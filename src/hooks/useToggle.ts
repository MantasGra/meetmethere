import { useReducer } from 'react';

const toggleReducer = (state: boolean, nextValue?: boolean) =>
  typeof nextValue === 'boolean' ? nextValue : !state;

const useToggle = (
  initialValue: boolean,
): [boolean, (nextValue?: boolean) => void] => {
  return useReducer(toggleReducer, initialValue);
};

export default useToggle;
