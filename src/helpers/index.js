export const randomHex = (n) => {
  let bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const findById = (collection, id) => {
  if (!collection) return null;
  return collection.find((item) => item.id === id);
};

export const upsert = (resources, resource) => {
  const index = resources.findIndex((i) => i.id === resource.id);

  if (resource.id && index !== -1) {
    resources[index] = resource;
  } else {
    resources.push(resource);
  }
};

export const docToResource = (doc) => {
  if (typeof doc?.data !== 'function') return doc;

  return { ...doc.data(), id: doc.id };
};

export const makeAppendChildToParentMutation = ({ parent, child }) => {
  return (state, { childId, parentId }) => {
    const resource = findById(state.items, parentId);

    if (!resource) {
      console.warn(
        `Appending ${child} ${childId} to ${parent} ${parentId} failed because the ${parent} didn't exist.`
      );
      return;
    }

    resource[child] = resource[child] || [];
    if (!resource[child].includes(childId)) resource[child].push(childId);
  };
};

export const makeFetchItemAction = ({ emoji, resource }) => {
  return ({ dispatch }, payload) =>
    dispatch('fetchItem', { resource, emoji, ...payload }, { root: true });
};

export const makeFetchItemsAction = ({ emoji, resource }) => {
  return ({ dispatch }, payload) =>
    dispatch('fetchItems', { resource, emoji, ...payload }, { root: true });
};
