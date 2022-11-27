import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type SpeechTextProps = {
  mdText: string,
  onTextComplete: Function,
  delay?: number
}

let innerTimer: NodeJS.Timeout;
let innerText = '';

export function SpeechText({ mdText, onTextComplete, delay }: SpeechTextProps) {
  const [ curText, setCurText ] = useState('');
  const [ isComplete, setIsComplete ] = useState(false);
  const getNextText = (partial: string, full: string) => {
    return full.slice(0, partial.length + 1);
  }

  const cleanText = useMemo(() => {
    return mdText.replaceAll('*', '');
  }, [ mdText ])

  const nextTextPlease = useCallback((fullText: string, reset?: boolean, delay?: number) => {
    if(reset) innerText = '';
    const startDelay = delay ? delay : 40;
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
    nextTextPlease(cleanText, true, delay);

    return () => {
      clearTimeout(innerTimer);
    }
  }, [ cleanText, nextTextPlease, delay ]);

  useEffect(() => {
    if(isComplete) onTextComplete();
  }, [ isComplete, onTextComplete ]);

  const displayText = useMemo(() => {
    if(isComplete) return mdText;
    return curText;
  }, [ isComplete, curText, mdText ])
  return (
    <ReactMarkdown>{displayText}</ReactMarkdown>
  );
}
