function* createIncrementer(start = 0, step = 1) {
  let n = start;
  while (true) {
    yield n;
    n += step;
  }
}

export default (start = 0, step = 1) => {
  const incrementer = createIncrementer(start, step);
  return () => incrementer.next().value;
};
