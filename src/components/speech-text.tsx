import { useCallback, useEffect, useState } from 'react';

type SpeechTextProps = {
  text: string,
  onTextComplete: Function
}

let innerTimer: NodeJS.Timeout;
let innerText = '';

export function SpeechText({ text, onTextComplete }: SpeechTextProps) {
  const [ curText, setCurText ] = useState('');
  const [ isComplete, setIsComplete ] = useState(false);
  const getNextText = (partial: string, full: string) => {
    return full.slice(0, partial.length + 1);
  }

  const nextTextPlease = useCallback((fullText: string, reset?: boolean) => {
    if(reset) innerText = '';
    innerTimer = setTimeout(() => {
      innerText = getNextText(innerText, fullText);
      setCurText(innerText);

      if(innerText.length !== fullText.length){
        nextTextPlease(fullText);
      }else{
        setIsComplete(true);
      }
    }, 50);
  }, [])

  useEffect(() => {
    setCurText('');
    setIsComplete(false);
    nextTextPlease(text, true);

    return () => {
      clearTimeout(innerTimer);
    }
  }, [ text, nextTextPlease ]);

  useEffect(() => {
    if(isComplete) onTextComplete();
  }, [ isComplete, onTextComplete ]);
  
  return (
    <p>{curText}</p>
  );
}
