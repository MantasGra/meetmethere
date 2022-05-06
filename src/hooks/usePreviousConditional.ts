import usePrevious from './usePrevious';

const usePreviousConditional = <T>(
  state: T,
  condition: boolean,
): T | undefined => {
  const previousState = usePrevious(state);
  if (condition) {
    return previousState;
  }
  return state;
};

export default usePreviousConditional;
