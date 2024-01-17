import { findById } from '@/helpers';
import firebase from '@/helpers/firebase';

export default {
  fetchItem: (
    { commit, state },
    {
      id,
      emoji,
      resource,
      handleUnsubscribe = null,
      once = false,
      onSnapshot = null,
    }
  ) =>
    new Promise((resolve) => {
      console.log('🔥', emoji, `${resource}-id: ${id}`);
      const unsubscribe = firebase
        .firestore()
        .collection(resource)
        .doc(id)
        .onSnapshot((doc) => {
          if (once) {
            unsubscribe();
          }
          if (doc.exists) {
            const item = { ...doc.data(), id: doc.id };
            let previousItem = findById(state[resource].item, id);
            previousItem = previousItem ? { ...previousItem } : null;
            commit('setItem', { resource, id, item });

            if (typeof onSnapshot === 'function') {
              const isLocal = doc.metadata.hasPendingWrites;
              onSnapshot({ item: { ...item }, previousItem, isLocal });
            }

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

  fetchItems: ({ dispatch }, { ids, resource, emoji, onSnapshot = null }) => {
    ids = ids || [];

    return Promise.all(
      ids.map((id) =>
        dispatch('fetchItem', { id, resource, emoji, onSnapshot })
      )
    );
  },

  unsubscribeAllSnapshots: async ({ state, commit }) => {
    state.unsubscribes.forEach((unsubscribe) => unsubscribe());
    commit('clearAllUnsubscribes');
  },
};
