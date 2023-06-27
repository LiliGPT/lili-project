"use client";

import { pickProjectThunk, selectAllProject, selectCurrentProjectUid, useAppDispatch, useAppSelector } from '@lili-project/lili-store';
import { CustomButton } from '../../Button';
import { Spacer } from '../../layout/Spacer';
import { SideProjectItem } from './SideProjectItem';
import './styles.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props { }

export function SideProjects(props: Props) {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectAllProject());
  const currentProjectUid = useAppSelector(selectCurrentProjectUid());

  const onClickOpenProject = () => {
    dispatch(pickProjectThunk());
  };

  return (
    <div className="SideProjects">
      {projects.map((project) => (
        <SideProjectItem
          key={project.project_uid}
          project_uid={project.project_uid}
          active={project.project_uid === currentProjectUid}
          name={project.display_name}
          project_dir={project.data.project_dir.replace(/\/home\/\w+\//, '~/')}
        />
      ))}
      <Spacer />
      <CustomButton
        label="Open Project"
        onClick={onClickOpenProject}
        size="large"
        variant="accent"
        disabled={false}
        fullWidth
      />
    </div>
  );
}