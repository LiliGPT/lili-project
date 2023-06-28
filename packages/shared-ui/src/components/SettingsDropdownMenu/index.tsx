import { useState } from "react";
import { BookIcon } from "../icons/BookIcon";

interface Props {
  menuOptions: string[];
  callbacks: (() => void)[];
  iconClassName?: string;
}

export function SettingsDropdownButton(props: Props) {
  const [visible, setVisible] = useState(false);
  const iconClassName = `cursor-pointer ${props.iconClassName ?? ""}`;

  const onClickCallback = (index: number) => {
    return () => {
      setVisible(false);
      props.callbacks[index]();
    };
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <span onClick={() => setVisible(!visible)}>
          <BookIcon className={iconClassName} width={14} height={14} fill={'#ccc'} />
        </span>
      </div>
      {visible && (
        <div className="z-50 origin-top-right absolute right-0 mt-0.5 w-44 rounded-md shadow-lg bg-boldy ring-1 ring-slate-500">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            {props.menuOptions.map((option, index) => (
              <div
                key={index}
                onClick={onClickCallback(index)}
                className="block px-4 py-1 text-xs text-slate-200 hover:bg-secondary hover:text-white cursor-pointer"
                role="menuitem"
              >{option}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
