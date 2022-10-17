import { useEffect, useRef, useState } from 'react';

type SpeechTextProps = {
  text: string,
  onTextComplete: Function
}
export function SpeechText({ text, onTextComplete }: SpeechTextProps) {
  const [ curText, setCurText ] = useState('');
  const [ isComplete, setIsComplete ] = useState(false);
  const timerRef: any = useRef();
  const getNextText = (partial: string, full: string) => {
    return full.slice(0, partial.length + 1);
  }

  useEffect(() => {
    if(curText.length < text.length){
      timerRef.current = setTimeout(() => {
        setCurText(getNextText(curText, text));
      }, 50);
    }else{
      if(!isComplete) {
        setIsComplete(true);
      }
    }
  }, [ curText, text, timerRef, isComplete ])

  useEffect(() => {
    setCurText('');
    setIsComplete(false);

    return () => {
      clearTimeout(timerRef.current);
    }
  }, [ text ]);

  useEffect(() => {
    if(isComplete) onTextComplete();
  }, [ isComplete, onTextComplete ]);
  
  return (
    <p>{curText}</p>
  );
}
