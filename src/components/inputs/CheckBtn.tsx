import { useEffect, useState } from "react";

interface CheckBtnProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children?: React.ReactNode;
  disabled?: boolean
}

export default function CheckBtn({ label, checked, onChange, children, disabled}: CheckBtnProps) {
  const [isChecked, setIsChecked] = useState(checked);

  const style = isChecked ? 'text-primary' : 'text-[#4b4b4b]';
  const disabledStyle = disabled ? 'opacity-50' : 'hover:brightness-125 hover:bg-custom-black';

  const handleClick = () => {
    if (disabled) return
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onChange(newChecked);
  };

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);
  

  return (
    <button onClick={handleClick} title={label} className={`flex ${style} p-2 aspect-square flex items-center align-middle justify-center rounded-md ${disabledStyle}`}
      style={{ cursor : disabled ? 'default' : 'pointer' }}
    >
      {children}
      <span className="absolute">
        {checked}
      </span>
    </button>
  )

}