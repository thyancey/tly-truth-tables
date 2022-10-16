import { useEffect, useRef, useState } from 'react';

type SpeechTextProps = {
  text: string
}
export function SpeechText({ text }: SpeechTextProps) {
  const [ curText, setCurText ] = useState('');
  const timerRef: any = useRef();
  const getNextText = (partial: string, full: string) => {
    return full.slice(0, partial.length + 1);
  }

  useEffect(() => {
    if(curText.length < text.length){
      timerRef.current = setTimeout(() => {
        setCurText(getNextText(curText, text));
      }, 50);
    }
  }, [ curText, text, timerRef ])

  useEffect(() => {
    setCurText('');

    return () => {
      clearTimeout(timerRef.current);
    }
  }, [ text ]);
  
  return (
    <p>{curText}</p>
  );
}
