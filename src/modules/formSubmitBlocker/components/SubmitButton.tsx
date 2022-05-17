import LoadingButton from '@mui/lab/LoadingButton';
import { ButtonProps } from '@mui/material';
import {
  Ref,
  useCallback,
  MouseEventHandler,
  useState,
  useRef,
  useEffect,
  forwardRef,
} from 'react';
import { useAppSelector } from 'src/hooks/redux';

import { formSubmitBlockerIsSubmittingSelector } from '../selectors';

const SUBMIT_TIMEOUT = 1000;

interface ISubmitButtonProps extends ButtonProps {
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  submitOnEnter?: boolean;
}

const SubmitButton = forwardRef(
  (props: ISubmitButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { onSubmit, submitOnEnter, onClick, ...rest } = props;
    const isSubmitting = useAppSelector(formSubmitBlockerIsSubmittingSelector);
    const [inTimeout, setInTimeout] = useState(false);
    const timeoutId = useRef<NodeJS.Timeout>();

    useEffect(
      () => () => timeoutId.current && clearTimeout(timeoutId.current),
      [],
    );

    const handleSubmit = useCallback(
      (e?: React.BaseSyntheticEvent) => {
        setInTimeout(true);
        onSubmit(e);
        timeoutId.current = setTimeout(() => {
          setInTimeout(false);
        }, SUBMIT_TIMEOUT);
      },
      [onSubmit],
    );

    const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
      (...params) => {
        onClick?.(...params);
        handleSubmit(params[0]);
      },
      [onClick, handleSubmit],
    );

    useEffect(() => {
      let listener: (event: KeyboardEvent) => void | undefined;
      if (submitOnEnter) {
        listener = (event: KeyboardEvent) => {
          if (event.code === 'Enter') {
            event.preventDefault();
            handleSubmit();
          }
        };
        document.addEventListener('keydown', listener);
      }
      return () => {
        document.removeEventListener('keydown', listener);
      };
    }, [submitOnEnter, handleSubmit]);

    return (
      <LoadingButton
        loading={isSubmitting || inTimeout}
        onClick={handleClick}
        ref={ref}
        {...rest}
      />
    );
  },
);

SubmitButton.displayName = 'SubmitButton';

export default SubmitButton;
