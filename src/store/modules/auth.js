import firebase from '@/helpers/firebase';
import useNotifications from '@/composables/useNotifications';

const { addNotification } = useNotifications();

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubscribe: null,
    authObserverUnsubscribe: null,
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      return rootGetters['users/user'](state.authId);
    },
  },
  actions: {
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

    fetchAuthUser: async ({ dispatch, commit }) => {
      const userId = firebase.auth().currentUser?.uid;
      if (!userId) return;

      commit('setAuthId', userId);

      await dispatch(
        'fetchItem',
        {
          resource: 'users',
          id: userId,
          emoji: '🙋‍♂️',
          handleUnsubscribe: (unsubscribe) => {
            commit('setAuthUserUnsubscribe', unsubscribe);
          },
        },
        { root: true }
      );
    },

    registerUserWithEmailAndPassword: async (
      { dispatch },
      { avatar = null, email, name, username, password }
    ) => {
      const result = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      avatar = await dispatch('uploadAvatar', {
        authId: result.user.uid,
        file: avatar,
      });

      await dispatch(
        'users/createUser',
        {
          id: result.user.uid,
          email,
          name,
          username,
          avatar,
        },
        { root: true }
      );
    },

    uploadAvatar: async ({ state }, { authId, file, filename }) => {
      if (!file) return null;
      authId = authId || state.authId;
      filename = filename || file.name;

      try {
        const storageBucket = firebase
          .storage()
          .ref()
          .child(`uploads/${authId}/images/${Date.now()}-${filename}`);
        const snapshot = await storageBucket.put(file);
        const url = await snapshot.ref.getDownloadURL();
        addNotification({
          message: 'Avatar image uploaded successfully',
          timeout: 5000,
          type: 'success',
        });

        return url;
      } catch (error) {
        addNotification({
          message: 'Error uploading avatar image',
          timeout: 5000,
          type: 'error',
        });
      }
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
        return dispatch(
          'users/createUser',
          {
            id: user.uid,
            name: user.displayName,
            email: user.email,
            username: user.email,
            avatar: user.photoURL,
          },
          { root: true }
        );
      }
    },

    signOut: async ({ commit }) => {
      await firebase.auth().signOut();
      commit('setAuthId', null);
    },

    fetchAuthUsersPosts: async ({ commit, state }, { startAfter }) => {
      let query = await firebase
        .firestore()
        .collection('posts')
        .where('userId', '==', state.authId)
        .orderBy('publishedAt', 'desc')
        .limit(10);

      if (startAfter) {
        const doc = await firebase
          .firestore()
          .collection('posts')
          .doc(startAfter.id)
          .get();
        query = query.startAfter(doc);
      }

      const posts = await query.get();

      posts.forEach((item) => {
        commit('setItem', { resource: 'posts', item }, { root: true });
      });
    },
    unsubscribeAuthUserSnapshot: async ({ state, commit }) => {
      if (state.authUserUnsubscribe) {
        state.authUserUnsubscribe();
        commit('setAuthUserUnsubscribe', null);
      }
    },
  },
  mutations: {
    setAuthId(state, id) {
      state.authId = id;
    },

    setAuthUserUnsubscribe(state, unsubscribe) {
      state.authUserUnsubscribe = unsubscribe;
    },

    setAuthObserverUnsubscribe(state, unsubscribe) {
      state.authObserverUnsubscribe = unsubscribe;
    },
  },
};
