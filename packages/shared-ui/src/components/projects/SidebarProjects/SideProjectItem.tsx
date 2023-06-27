import { projectActions, useAppDispatch } from '@lili-project/lili-store';
import { CloseIcon } from '../../icons/CloseIcon';

interface Props {
  name: string;
  project_dir: string;
  project_uid: string;
  active: boolean;
}

export function SideProjectItem(props: Props) {
  const dispatch = useAppDispatch();
  const { name, project_dir, project_uid } = props;

  const onClick = async () => {
    await dispatch(projectActions.setOpenedProjectUid(project_uid));
  }

  return (
    <button
      className={`SideProjectItem ${props.active ? 'active' : 'inactive'}`}
      onClick={onClick}
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
    </button>
  );
}