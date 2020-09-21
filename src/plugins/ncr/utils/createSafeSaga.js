export default function createSafeSaga(sagaFlow, name = 'createSafeSaga') {
  return function* (action) {
    try {
      yield* sagaFlow(action);
    } catch (error) {
      yield console.error(`${name}: `, error);
    }
  };
}
