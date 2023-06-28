import './styles.css';

interface Props {
  label: string;
  onClick: () => void;
  size: 'small' | 'medium' | 'large' | 'flex';
  variant: 'primary' | 'secondary' | 'accent' | 'danger' | 'boldy';
  disabled?: boolean;
  fullWidth?: boolean;
  rounded?: boolean;
}

export function CustomButton(props: Props) {
  const {
    label,
    onClick,
    size,
    variant,
    disabled,
    fullWidth = false,
    rounded,
  } = props;

  const fullWidthClass = fullWidth ? 'fullWidth' : '';
  const roundedClass = rounded || rounded === undefined ? 'is-rounded' : 'is-sharp';
  const disabledClass = disabled ? 'is-disabled' : 'is-enabled';

  return (
    <button
      className={`CustomButton ${size} ${variant} ${fullWidthClass} ${roundedClass} ${disabledClass}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}