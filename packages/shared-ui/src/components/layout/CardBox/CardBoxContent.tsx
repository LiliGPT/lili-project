interface Props {
  children: React.ReactNode;
}

export function CardBoxContent(props: Props) {
  const { children } = props;
  return (
    <div className="px-3 pt-2 pb-8 text-slate-500">
      {children}
    </div>
  );
}

