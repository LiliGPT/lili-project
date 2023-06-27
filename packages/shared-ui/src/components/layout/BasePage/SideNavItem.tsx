interface Props {
  label: string;
  icon: (props: { width: number, height: number }) => JSX.Element;
  onClick: () => void;
  className?: string;
  active: boolean;
}

export function SideNavItem(props: Props) {
  const {
    label,
    icon: Icon,
    onClick,
    active,
    className = '',
  } = props;

  return (
    <button className={`AppMenuItem ${active ? 'active' : ''}`} onClick={onClick}>
      <Icon width={32} height={32} />
      <span className="AppMenuTooltip">{label}</span>
    </button>
  );
}
