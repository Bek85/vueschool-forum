import firebase from '@/helpers/firebase';

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {},
  actions: {
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

      const userRef = firebase
        .firestore()
        .collection('users')
        .doc(state.authId);

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
  },
  mutations: {},
};
