import { useEffect, useState } from "react";
import { MdOutlineRotateLeft, MdOutlineRotateRight } from "react-icons/md";
import { useImages } from "../../hooks/useImages";

interface Props {
  onChange?: (value: number) => void,
  disabled?: boolean
}
/**
 * Component for an input field that allows users to enter a number between 0 and 360.
 * 
 * @param {Props} props - The props for the component.
 * @returns {JSX.Element} - The JSX element representing the RotateInput component.
 */
export default function RotateInput({onChange, disabled}: Props): JSX.Element {
  const [inputValue, setInputValue] = useState("0.00");
  const {currentImage} = useImages()
  const regex = /^$|^[0-9]*\.?[0-9]{0,2}$/
  const disabledStyle = disabled ? 'opacity-50' : 'hover:brightness-125 hover:bg-custom-black';
  
  useEffect(() => {
    if (currentImage) setInputValue(currentImage.rotation.toFixed(2).toString());
  }, [currentImage?.path]);

  useEffect(() => {
    if (onChange) {
      const input =  parseFloat(inputValue);
      const value = isNaN(input) ? 0 : input
      onChange(parseFloat(value.toFixed(2)));
    };
  }, [inputValue]);


  const evaluateInput = (value: string) =>{
    if (!regex.test(value)) {
      return;
    }
    if (value.trim() === ".") {
      setInputValue("0.");
      return
    }
    if (parseFloat(value) > 360) {
      setInputValue("360.00");
      return;
    }
    if (parseFloat(value) < -360) {
      setInputValue("-360.00");
      return;
    }
    setInputValue(value);
  }

  const handleBlur = () => {
    if (disabled) return
    if (inputValue.trim() === "") {
      setInputValue("0.00");
    }
    else{
      setInputValue(parseFloat(inputValue).toFixed(2).toString());
    }
  }

  const handleLeftClick = () => {
    if (disabled) return
    const value = parseFloat(inputValue) - 1.0;
    if (value > 360) {
      setInputValue("0.00");
      return;
    }
    if (value < -360) {
      setInputValue("0.00");
      return;
    }
    setInputValue(value.toFixed(2).toString());
  }
  const handleRightClick = () => {
    if (disabled) return
    const value = parseFloat(inputValue) + 1.0;
    if (value > 360) {
      setInputValue("0.00");
      return;
    }
    if (value < -360) {
      setInputValue("0.00");
      return;
    }

    setInputValue(value.toFixed(2).toString());
  }
  
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    let differenceValue = 0.1
    if (event.shiftKey){
      differenceValue = 1
    }else if (event.ctrlKey){
      differenceValue = 0.01
    }

    switch (event.key) {
      case 'Enter':
        handleBlur();
        return
      case 'ArrowLeft':
        handleLeftClick();
        return
      case 'ArrowRight':
        handleRightClick();
        return
      case 'ArrowUp':
        setInputValue((parseFloat(inputValue) + differenceValue).toFixed(2).toString());
        return
      case 'ArrowDown':
        setInputValue((parseFloat(inputValue) - differenceValue).toFixed(2).toString());
        return
    }
  }

  return (
    <div className="flex flex-row gap-1"
      style={{
        color : disabled ? "grey" : "var(--color-primary)"
      }}
    >
      <button onClick={handleLeftClick} className={`flex p-2 bg-custom-black aspect-square items-center align-middle justify-center rounded-md ${disabledStyle}`}
        style = {{cursor : disabled ? 'default' : 'pointer'}}
      >
        <MdOutlineRotateLeft />
      </button>
      <input disabled={disabled} type="text" className="bg-custom-lighter-black px-2 rounded-md w-17 h-full font-mono text-end" value={disabled ? "0.0" : inputValue} onChange={(e) => evaluateInput(e.target.value)} 
      onBlur={handleBlur}
      style={{
        color : disabled ? "grey" : "white"
      }}
      onKeyUp={handleKeyPress}
      />
      <button onClick={handleRightClick} className={`flex p-2 bg-custom-black aspect-square items-center align-middle justify-center rounded-md ${disabledStyle}`}
        style = {{cursor : disabled ? 'default' : 'pointer'}}
      >
        <MdOutlineRotateRight />
      </button>
    </div>
  )
}