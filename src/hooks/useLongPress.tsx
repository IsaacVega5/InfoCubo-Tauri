import { useRef, useState } from "react";

interface actions {
  click? : (event:React.MouseEvent<HTMLElement>) => void,
  longPress? : (event:React.MouseEvent<HTMLElement>) => void,
  pressStop? : () => void,
  wait ?: number
}

export default function useLongPress({
  click = () => {}, 
  longPress = () => {},
  pressStop = () => {},
  wait = 500
}: actions) {

const [action, setAction] = useState('');
const timerRef = useRef(0);
const isLongPress = useRef<boolean>(false);

function startPressTimer(event: React.MouseEvent<HTMLElement>) {
  isLongPress.current = false;
  timerRef.current = setTimeout(() => {
    isLongPress.current = true;
    longPress(event);
    setAction('longPress');
  }, wait);
}

function handleOnClick(event: React.MouseEvent<HTMLElement>) {
  if (isLongPress.current) return
  setAction('click');
  click(event);
}

function handleOnMouseDown(event: React.MouseEvent<HTMLElement>) {
  startPressTimer(event);
}

function handleOnMouseUp() {
  clearTimeout(timerRef.current);
  if (isLongPress.current){
    pressStop();
  }
}

function handleOnTouchStart() {
  // Necesitarías adaptar esto para eventos táctiles
  const mouseEvent = {} as React.MouseEvent<HTMLElement>;
  startPressTimer(mouseEvent);
}

function handleOnTouchEnd() {
  if (action === 'longPress') return;

  clearTimeout(timerRef.current);
  if (isLongPress.current){
    isLongPress.current = false;
    pressStop();
  }
  // pressStop();
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