interface Props {
  label: string;
  icon: (props: { width: number, height: number }) => JSX.Element;
  href: string;
  className?: string;
  active: boolean;
}

export function SideNavItem(props: Props) {
  const {
    label,
    icon: Icon,
    href,
    active,
    className = '',
  } = props;

  return (
    <button className={`AppMenuItem ${active ? 'active' : ''}`}>
      <Icon width={32} height={32} />
      <span className="AppMenuTooltip">{label}</span>
    </button>
  );
}
