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

const SubmitButton = forwardRef(
  (props: ButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { onClick, ...rest } = props;
    const isSubmitting = useAppSelector(formSubmitBlockerIsSubmittingSelector);
    const [inTimeout, setInTimeout] = useState(false);
    const timeoutId = useRef<NodeJS.Timeout>();

    useEffect(
      () => () => timeoutId.current && clearTimeout(timeoutId.current),
      [],
    );

    const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
      (...params) => {
        setInTimeout(true);
        onClick?.(...params);
        timeoutId.current = setTimeout(() => {
          setInTimeout(false);
        }, SUBMIT_TIMEOUT);
      },
      [onClick],
    );

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
