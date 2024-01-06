import { docToResource, findById, upsert } from '@/helpers';

export default {
  setAuthId(state, id) {
    state.authId = id;
  },

  setItem(state, { resource, item }) {
    upsert(state[resource], docToResource(item));
  },

  appendUnsubscribe(state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe);
  },

  clearAllUnsubscribes(state) {
    state.unsubscribes = [];
  },

  setPost(state, { post }) {
    upsert(state.posts, post);
  },

  setThread(state, { thread }) {
    upsert(state.threads, thread);
  },

  setUser(state, { user }) {
    upsert(state.users, user);
  },

  appendPostToThread: makeAppendChildToParentMutation({
    parent: 'threads',
    child: 'posts',
  }),

  appendThreadToForum: makeAppendChildToParentMutation({
    parent: 'forums',
    child: 'threads',
  }),

  appendThreadToUser: makeAppendChildToParentMutation({
    parent: 'users',
    child: 'threads',
  }),
  appendContributorToThread: makeAppendChildToParentMutation({
    parent: 'threads',
    child: 'contributors',
  }),
};

function makeAppendChildToParentMutation({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId);

    if (!resource) {
      console.warn(
        `Appending ${child} ${childId} to ${parent} ${parentId} failed because the ${parent} didn't exist.`
      );
      return;
    }

    resource[child] = resource[child] || [];
    if (!resource[child].includes(childId)) resource[child].push(childId);
  };
}
