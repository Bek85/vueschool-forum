import firebase from '@/helpers/firebase';
import { findById } from '@/helpers';

export default {
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

  fetchThread: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'threads', id, emoji: '📄' }),

  fetchThreads: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'threads', ids, emoji: '📄' }),

  fetchForum: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'forums', id, emoji: '📕' }),

  fetchForums: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'forums', ids, emoji: '📕' }),

  fetchUser: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'users', id, emoji: '🙋‍♂️' }),

  fetchAuthUser: ({ dispatch, state }) =>
    dispatch('fetchItem', { resource: 'users', id: state.authId, emoji: '🙋‍♂️' }),

  fetchUsers: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'users', ids, emoji: '🙋‍♂️' }),

  fetchPost: ({ dispatch }, { id }) =>
    dispatch('fetchItem', { resource: 'posts', id, emoji: '💭' }),

  fetchPosts: ({ dispatch }, { ids }) =>
    dispatch('fetchItems', { resource: 'posts', ids, emoji: '💭' }),

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

  createThread: async (
    { commit, state, dispatch },
    { text, title, forumId }
  ) => {
    const userId = state.authId;
    const publishedAt = firebase.firestore.FieldValue.serverTimestamp();

    const threadRef = firebase.firestore().collection('threads').doc();

    const thread = {
      forumId,
      title,
      publishedAt,
      userId,
      id: threadRef.id,
    };

    const userRef = firebase.firestore().collection('users').doc(userId);

    const forumRef = firebase.firestore().collection('forums').doc(forumId);

    const batch = firebase.firestore().batch();

    batch.set(threadRef, thread);

    batch.update(userRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
    });

    batch.update(forumRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id),
    });

    await batch.commit();

    const newThread = await threadRef.get();

    commit('setItem', {
      resource: 'threads',
      item: { ...newThread.data(), id: newThread.id },
    });
    commit('appendThreadToUser', { parentId: userId, childId: threadRef.id });
    commit('appendThreadToForum', { parentId: forumId, childId: threadRef.id });

    await dispatch('createPost', { text, threadId: threadRef.id });

    return findById(state.threads, threadRef.id);
  },

  updateThread: async ({ commit, state }, { title, text, id }) => {
    const thread = findById(state.threads, id);

    const post = findById(state.posts, thread.posts[0]).text;

    const newThread = {
      ...thread,
      title,
    };

    const newPost = {
      ...post,
      text,
    };

    commit('setThread', {
      thread: newThread,
    });
    commit('setPost', {
      post: newPost,
    });

    return newThread;
  },

  updateUser: (context, user) =>
    context.commit('setUser', { user, userId: user.id }),

  fetchItem: ({ state, commit }, { id, emoji, resource }) =>
    new Promise((resolve) => {
      console.log('🔥', emoji, `${resource}-id: ${id}`);
      firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          const item = { ...doc.data(), id: doc.id };
          commit('setItem', { resource, id, item });
          resolve(item);
        });
    }),

  fetchItems: ({ dispatch }, { ids, resource, emoji }) =>
    Promise.all(
      ids.map((id) => dispatch('fetchItem', { id, resource, emoji }))
    ),
};
