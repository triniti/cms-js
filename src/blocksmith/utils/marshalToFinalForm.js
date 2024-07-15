// final form (FormMarshaler) turns key/value fields into
// an array of [{key, value}] objects. at the moment this
// is only the "data" field on the iframe-block.
export default (pbj) => {
  if (!pbj.data) {
    return pbj;
  }

  const newPbj = { ...pbj };
  const data = newPbj.data;
  newPbj.data = [];
  for (const [key, value] of Object.entries(data)) {
    newPbj.data.push({ key, value });
  }

  return newPbj;
};
