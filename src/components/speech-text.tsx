import { useCallback, useEffect, useState } from 'react';

type SpeechTextProps = {
  text: string,
  onTextComplete: Function,
  delay?: number
}

let innerTimer: NodeJS.Timeout;
let innerText = '';

export function SpeechText({ text, onTextComplete, delay }: SpeechTextProps) {
  const [ curText, setCurText ] = useState('');
  const [ isComplete, setIsComplete ] = useState(false);
  const getNextText = (partial: string, full: string) => {
    return full.slice(0, partial.length + 1);
  }

  const nextTextPlease = useCallback((fullText: string, reset?: boolean, delay?: number) => {
    if(reset) innerText = '';
    const startDelay = delay ? delay : 50;
    innerTimer = setTimeout(() => {
      innerText = getNextText(innerText, fullText);
      setCurText(innerText);

      if(innerText.length !== fullText.length){
        nextTextPlease(fullText);
      }else{
        setIsComplete(true);
      }
    }, startDelay);
  }, [])

  useEffect(() => {
    setCurText('');
    setIsComplete(false);
    nextTextPlease(text, true, delay);

    return () => {
      clearTimeout(innerTimer);
    }
  }, [ text, nextTextPlease, delay ]);

  useEffect(() => {
    if(isComplete) onTextComplete();
  }, [ isComplete, onTextComplete ]);
  
  return (
    <p>{curText}</p>
  );
}
