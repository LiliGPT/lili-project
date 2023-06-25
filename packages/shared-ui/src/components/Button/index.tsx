import './styles.css';

interface Props {
  label: string;
  onClick: () => void;
  size: 'small' | 'medium' | 'large';
  variant: 'primary' | 'secondary' | 'accent' | 'danger';
  disabled: boolean;
  fullWidth?: boolean;
}

export function CustomButton(props: Props) {
  const {
    label,
    onClick,
    size,
    variant,
    disabled,
    fullWidth = false,
  } = props;

  return (
    <button
      className={`CustomButton ${size} ${variant} ${fullWidth ? 'fullWidth' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}