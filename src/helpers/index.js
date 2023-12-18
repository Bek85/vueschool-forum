export const findById = (collection, id) => {
  return collection.find((item) => item.id === id);
};
