interface Props {
  label: string;
  icon: (props: { width: number, height: number }) => JSX.Element;
  onClick: () => void;
  className?: string;
  active: boolean;
  variant?: 'normal' | 'highlighted';
}

export function SideNavItem(props: Props) {
  const {
    label,
    icon: Icon,
    onClick,
    active,
    variant = 'normal',
  } = props;

  return (
    <button className={`AppMenuItem ${active ? 'active' : ''} variant-${variant}`} onClick={onClick}>
      <Icon width={32} height={32} />
      <span className="AppMenuTooltip">{label}</span>
    </button>
  );
}
