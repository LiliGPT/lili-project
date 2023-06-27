import { CustomButton } from '../Button';
import './TextInput.styles.css';

interface Props {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  action: {
    label: string;
    onClick: () => void;
  };
  multiline?: boolean;
}

export function TextInput(props: Props) {
  const { label, value, onChange, action, multiline } = props;

  return (
    <div className="TextInput">
      <textarea
        className="InputTag Text MultiLine"
        // onChange={(e) => onChange && onChange(e.target.value)}
      ></textarea>
      <CustomButton
        label={action.label}
        size="flex"
        variant="secondary"
        disabled={false}
        onClick={action.onClick}
        rounded={false}
      />
    </div>
  );
}