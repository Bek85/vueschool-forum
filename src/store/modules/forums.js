import {
  makeAppendChildToParentMutation,
  makeFetchItemAction,
  makeFetchItemsAction,
} from '@/helpers';

export default {
  namespaced: true,
  state: {
    items: [],
  },
  getters: {},
  actions: {
    fetchForum: makeFetchItemAction({ resource: 'forums', emoji: '📕' }),

    fetchForums: makeFetchItemsAction({ resource: 'forums', emoji: '📕' }),
  },
  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({
      parent: 'forums',
      child: 'threads',
    }),
  },
};
