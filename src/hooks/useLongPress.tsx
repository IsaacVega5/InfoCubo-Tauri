import { useRef, useState } from "react";

interface actions {
  click? : (event:React.MouseEvent<HTMLElement>) => void,
  longpress? : (event:React.MouseEvent<HTMLElement>) => void,
  wait ?: number
}

export default function useLongPress({
    click = () => {}, 
    longpress = () => {},
    wait = 500
  }: actions) {
  
  const [action, setAction] = useState('');
  const timerRef = useRef(0);
  const isLongPress = useRef<boolean>(false);
  const [currentEvent, setCurrentEvent] = useState<React.MouseEvent<HTMLElement> | null>(null);

  function startPressTimer() {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      if ( !currentEvent ) return
      longpress(currentEvent);
      setAction('longpress');
    }, wait);
  }

  function handleOnClick(event: React.MouseEvent<HTMLElement>) {
    setCurrentEvent(event);
    // console.log('handleOnClick');
    if ( isLongPress.current ) {
      // console.log('Is long press - not continuing.');
      return;
    }
    setAction('click');
    click(event);
  }

  function handleOnMouseDown() {
    // console.log('handleOnMouseDown');
    startPressTimer();
  }

  function handleOnMouseUp() {
    // console.log('handleOnMouseUp');
    clearTimeout(timerRef.current);
  }

  function handleOnTouchStart() {
    // console.log('handleOnTouchStart');
    startPressTimer();
  }

  function handleOnTouchEnd() {
    if ( action === 'longpress' ) return;
    // console.log('handleOnTouchEnd');
    clearTimeout(timerRef.current);
  }

  return {
    action,
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd
    }
  }
}