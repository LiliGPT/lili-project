import './styles.css';

interface Props {
  title: string;
}

export function PageTitle(props: Props) {
  return (
    <div className="PageTitle">
      <h1>Project 1</h1>
    </div>
  );
}
