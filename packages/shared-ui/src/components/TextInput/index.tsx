import { CustomButton } from '../Button';
import './TextInput.styles.css';

interface Props {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  multiline?: boolean;
  password?: boolean;
}

export function TextInput(props: Props) {
  const { label, value, onChange, action, multiline, password } = props;
  const multilineClass = multiline ? 'MultiLine' : 'SingleLine';
  let tagComponent: JSX.Element;
  if (multiline) {
    tagComponent = <textarea
      className="InputTag"
      onChange={(e) => onChange && onChange(e.target.value)}
      value={value}
    ></textarea>;
  } else {
    tagComponent = <input
      className="InputTag"
      type={password ? 'password' : 'text'}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
    />;
  }

  let labelComponent: JSX.Element = <></>;
  if (label) {
    labelComponent = <span className="InputLabel">{label}</span>;
  }

  return (
    <div className={`TextInput ${multilineClass}`}>
      {labelComponent}
      {tagComponent}
      {!!action && (
        <CustomButton
          label={action.loading ? 'loading...' : action.label}
          size="flex"
          variant="secondary"
          disabled={action.loading}
          onClick={action.onClick}
          rounded={false}
        />
      )}
    </div>
  );
}