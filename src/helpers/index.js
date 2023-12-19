export const randomHex = (n) => {
  let bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export const findById = (collection, id) => {
  return collection.find((item) => item.id === id);
};

export const upsert = (collection, item) => {
  const index = collection.findIndex((i) => i.id === item.id);

  if (item.id && index !== -1) {
    collection[index] = item;
  } else {
    collection.push(item);
  }
};
