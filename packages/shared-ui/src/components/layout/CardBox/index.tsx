interface Props {
  children: React.ReactNode;
}

export function CardBox(props: Props) {
  const { children } = props;
  return (
    <div className="bg-primary rounded-xl flex-grow shadow-xl">
      {children}
    </div>
  );
}

