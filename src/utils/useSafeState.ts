import { useState, useEffect, useRef } from 'react'

export default function useSafeState(initialValue: any) {
  const isMountedRef = useRef(true);
  const [currentValue, setCurrentValue] = useState(initialValue);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, [isMountedRef]);

  const setSafeState = (value: any) => {
    if (isMountedRef && isMountedRef.current) {
      setCurrentValue(value);
    }
  };
  return [currentValue, setSafeState];
}

