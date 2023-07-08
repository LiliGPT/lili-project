interface Props {
  children: React.ReactNode;
}

export function CardBoxContent(props: Props) {
  const { children } = props;
  return (
    <div className="px-3 py-2 text-slate-500">
      {children}
    </div>
  );
}

