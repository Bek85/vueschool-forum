import firebase from '@/helpers/firebase';
import { docToResource, findById } from '@/helpers';

export default {
  initAuthentication: ({ dispatch, commit, state }) => {
    if (state.authObserverUnsubscribe) state.authObserverUnsubscribe();

    return new Promise((resolve) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
        console.log('🔥🙋 the user has changed');
        dispatch('unsubscribeAuthUserSnapshot');
        if (user) {
          await dispatch('fetchAuthUser');
          resolve(user);
        } else {
          resolve(null);
        }
      });
      commit('setAuthObserverUnsubscribe', unsubscribe);
    });
  },

  fetchAllCategories: ({ commit }) =>
    new Promise((resolve) => {
      console.log('🔥', '📠', 'categories');
      firebase
        .firestore()
        .collection('categories')
        .onSnapshot((querySnapshot) => {
          const categories = querySnapshot.docs.map((doc) => {
            const item = { ...doc.data(), id: doc.id };
            commit('setItem', { resource: 'categories', item });
            return item;
          });
          resolve(categories);
        });
    }),

  fetchCategory: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'categories', id, emoji: '📠' }),

  fetchForum: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'forums', id, emoji: '📕' }),

  fetchForums: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'forums', ids, emoji: '📕' }),

  fetchUser: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'users', id, emoji: '🙋‍♂️' }),

  fetchAuthUser: async ({ dispatch, commit }) => {
    const userId = firebase.auth().currentUser?.uid;
    if (!userId) return;

    commit('setAuthId', userId);

    await dispatch('fetchItem', {
      resource: 'users',
      id: userId,
      emoji: '🙋‍♂️',
      handleUnsubscribe: (unsubscribe) => {
        commit('setAuthUserUnsubscribe', unsubscribe);
      },
    });
  },

  fetchUsers: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋‍♂️' }),

  fetchPost: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'posts', id, emoji: '💭' }),

  fetchPosts: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'posts', ids, emoji: '💭' }),

  fetchAuthUsersPosts: async ({ commit, state }) => {
    const posts = await firebase
      .firestore()
      .collection('posts')
      .where('userId', '==', state.authId)
      .get();
    console.log(posts);

    posts.forEach((item) => {
      commit('setItem', { resource: 'posts', item });
    });
  },

  createPost: async ({ commit, state }, post) => {
    // post.id = randomHex(10);
    // post.userId = state.authId;
    post.publishedAt = firebase.firestore.FieldValue.serverTimestamp();

    const batch = firebase.firestore().batch();
    const postRef = firebase.firestore().collection('posts').doc();
    const threadRef = firebase
      .firestore()
      .collection('threads')
      .doc(post.threadId);

    const userRef = firebase.firestore().collection('users').doc(state.authId);

    batch.set(postRef, post);

    batch.update(threadRef, {
      posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.authId),
    });

    batch.update(userRef, {
      postsCount: firebase.firestore.FieldValue.increment(1),
    });

    await batch.commit();
    const newPost = await postRef.get();

    // const newPost = await firebase.firestore().collection('posts').add(post);

    // await firebase
    //   .firestore()
    //   .collection('threads')
    //   .doc(post.threadId)
    //   .update({
    //     posts: firebase.firestore.FieldValue.arrayUnion(newPost.id),
    //     contributors: firebase.firestore.FieldValue.arrayUnion(state.authId),
    //   });

    commit('setItem', {
      resource: 'posts',
      item: { ...newPost.data(), id: newPost.id },
    });

    commit('appendPostToThread', {
      childId: newPost.id,
      parentId: post.threadId,
    });

    commit('appendContributorToThread', {
      childId: state.authId,
      parentId: post.threadId,
    });
  },
  updatePost: async ({ commit, state }, { text, id }) => {
    const post = {
      text,
      edited: {
        at: firebase.firestore.FieldValue.serverTimestamp(),
        by: state.authId,
        moderated: false,
      },
    };
    const postRef = firebase.firestore().collection('posts').doc(id);
    await postRef.update(post);
    const updatedPost = await postRef.get();
    commit('setItem', { resource: 'posts', item: updatedPost });
  },

  registerUserWithEmailAndPassword: async (
    { dispatch },
    { avatar = null, email, name, username, password }
  ) => {
    const result = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);

    await dispatch('createUser', {
      id: result.user.uid,
      email,
      name,
      username,
      avatar,
    });

    // await dispatch('fetchAuthUser');
  },

  signInWithEmailAndPassword: async (commit, { email, password }) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  },

  signInWithGoogle: async ({ dispatch }) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const response = await firebase.auth().signInWithPopup(provider);

    const user = response.user;
    const userRef = firebase.firestore().collection('users').doc(user.uid);

    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return dispatch('createUser', {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        username: user.email,
        avatar: user.photoURL,
      });
    }
  },

  signOut: async ({ commit }) => {
    await firebase.auth().signOut();
    commit('setAuthId', null);
  },

  createUser: async (
    { commit },
    { id, email, name, username, avatar = null }
  ) => {
    const registeredAt = firebase.firestore.FieldValue.serverTimestamp();
    const usernameLower = username.toLowerCase();
    email = email.toLowerCase();
    const user = {
      avatar,
      email,
      name,
      username,
      usernameLower,
      registeredAt,
    };

    const userRef = await firebase.firestore().collection('users').doc(id);

    userRef.set(user);
    const newUser = await userRef.get();
    commit('setItem', { resource: 'users', item: newUser });

    return docToResource(newUser);
  },

  updateUser: async (context, user) => {
    const updates = {
      avatar: user.avatar || null,
      username: user.username || null,
      name: user.name || null,
      bio: user.bio || null,
      website: user.website || null,
      email: user.email || null,
      location: user.location || null,
    };

    const userRef = firebase.firestore().collection('users').doc(user.id);

    await userRef.update(updates);

    context.commit('setItem', { resource: 'users', item: user });
  },

  fetchItem: ({ commit }, { id, emoji, resource, handleUnsubscribe = null }) =>
    new Promise((resolve) => {
      console.log('🔥', emoji, `${resource}-id: ${id}`);
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const item = { ...doc.data(), id: doc.id };
            commit('setItem', { resource, id, item });

            resolve(item);
          } else {
            resolve(null);
          }
        });

      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe);
      } else {
        commit('appendUnsubscribe', { unsubscribe });
      }
    }),

  fetchItems: ({ dispatch }, { ids, resource, emoji }) =>
    Promise.all(
      ids.map((id) => dispatch('fetchItem', { id, resource, emoji }))
    ),

  unsubscribeAllSnapshots: async ({ state, commit }) => {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe());
    commit('clearAllUnsubscribes');
  },

  unsubscribeAuthUserSnapshot: async ({ state, commit }) => {
    if (state.authUserUnsubscribe) {
      state.authUserUnsubscribe();
      commit('setAuthUserUnsubscribe', null);
    }
  },
};
