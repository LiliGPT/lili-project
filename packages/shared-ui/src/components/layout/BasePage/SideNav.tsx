interface Props {
  children: React.ReactNode;
  className?: string;
}

export function SideNav(props: Props) {
  const {
    children,
    className = '',
  } = props;
  return (
    <div className={`AppMenu ${className}`}>
      {children}
    </div>
  );
}