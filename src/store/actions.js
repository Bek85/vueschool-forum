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
