import './styles.css';

interface Props {
  title: string;
}

export function PageTitle(props: Props) {
  return (
    <div className="PageTitle">
      <h1>{props.title}</h1>
    </div>
  );
}
