"use client";

import { ReduxCodeProject, selectMissionExecution, useAppSelector } from "@lili-project/lili-store";
import './styles.css';
import { RunnableCommand, RunnableCommandStatus } from "../RunnableCommand";
import { CustomButton } from "../../Button";
import { ProjectDetails } from "./ProjectDetails";
import { MissionDetails } from "./MissionDetails";

interface Props {
  missionOpened: boolean;
  onClickOpenMission: () => void;
  onClickCloseMission: () => void;
  project: ReduxCodeProject;
}

export function ProjectCardLayout(props: Props) {
  const { project, missionOpened, onClickOpenMission, onClickCloseMission } = props;
  const execution = useAppSelector(selectMissionExecution(`new-${project.data.project_dir}`));

  return (
    <div className="ProjectCard">
      <div className="ProjectCard_header">
        <div className="ProjectCard_title">
          {project.display_name}
          {missionOpened && (
            <div className="ProjectCard_subtitle">
              New mission
            </div>
          )}
        </div>
        {!missionOpened && (
          <div className="">
            <CustomButton
              label="New Mission"
              size="small"
              variant="accent"
              disabled={false}
              onClick={onClickOpenMission}
            />
          </div>
        )}
        {missionOpened && (
          <div className="">
            <CustomButton
              label="Cancel"
              size="small"
              variant="danger"
              disabled={false}
              onClick={onClickCloseMission}
            />
          </div>
        )}
      </div>

      {!missionOpened && (
        <ProjectDetails project={project} />
      )}

      {missionOpened && (
        <MissionDetails project={project} execution={execution} />
      )}
    </div>
  );
}