import { useEffect, useRef, useState } from 'react';

type HintTextProps = {
  hintText: string
}
export function HintText({ hintText }: HintTextProps) {
  const [ curText, setCurText ] = useState('');
  const timerRef: any = useRef();

  const getNextText = (partial: string, full: string) => {
    return full.slice(0, partial.length + 1);
  }

  useEffect(() => {
    if(curText.length < hintText.length){
      timerRef.current = setTimeout(() => {
        setCurText(getNextText(curText, hintText));
      }, 50);
    }
  }, [ curText, hintText, timerRef ])

  useEffect(() => {
    setCurText('');

    return () => {
      clearTimeout(timerRef.current);
    }
  }, []);
  
  return (
    <p>{curText}</p>
  );
}
