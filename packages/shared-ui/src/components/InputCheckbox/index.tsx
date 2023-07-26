interface Props {
  label: string;
  checked: boolean;
  onClick: () => void;
}

export function InputCheckbox(props: Props) {
  const { label, checked, onClick } = props;
  return (
    <div className="flex flex-row items-center gap-2 hover:cursor-pointer" onClick={onClick}>
      <input
        className="appearance-none bg-transparent checked:bg-emerald-700 checked:border-transparent w-4 h-4 p-0 border-2 border-gray-700 scale-75"
        type="checkbox"
        checked={checked}
        onChange={() => {
          // do nothing
        }}
      />
      <span
        className="inline-block text-sm text-gray-400"
      >
        {label}
      </span>
    </div>
  );
}