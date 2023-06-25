"use client";

import { CustomButton } from '../../Button';
import { Spacer } from '../../layout/Spacer';
import { SideProjectItem } from './SideProjectItem';
import './styles.css';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props { }

export function SideProjects(props: Props) {
  const onClickAddProject = () => {
    //
  };

  return (
    <div className="SideProjects">
      <SideProjectItem name="Project 1" project_dir="~/projects/project1" />
      <SideProjectItem name="Project 2" project_dir="~/projects/project2" />
      <Spacer />
      <CustomButton
        label="Add Project"
        onClick={onClickAddProject}
        size="large"
        variant="accent"
        disabled={false}
        fullWidth
      />
    </div>
  );
}