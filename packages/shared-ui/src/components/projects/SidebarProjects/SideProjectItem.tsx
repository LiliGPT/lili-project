import { CloseIcon } from '../../icons/CloseIcon';

interface Props {
  name: string;
  project_dir: string;
}

export function SideProjectItem(props: Props) {
  const { name, project_dir } = props;
  return (
    <div
      className="SideProjectItem"
    >
      <div className="SideProjectItem_CloseIcon">
        <CloseIcon
          width={12}
          height={12}
          fill="white"
        />
      </div>
      <div className="text-sm font-semibold text-white">
        {name}
      </div>

      <div className="text-xs">
        {project_dir}
      </div>
    </div>
  );
}