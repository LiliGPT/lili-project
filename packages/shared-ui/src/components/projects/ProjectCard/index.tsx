"use client";

import { CodeMission, ReduxCodeProject } from "@lili-project/lili-store";
import { ProjectCardLayout } from "./layout";
import { useState } from "react";

interface Props {
  project: ReduxCodeProject;
}

export function ProjectCard(props: Props) {
  const { project } = props;
  const [missionOpened, setMissionOpened] = useState(true);

  return (
    <ProjectCardLayout
      missionOpened={missionOpened}
      onClickOpenMission = {() => setMissionOpened(true)}
      onClickCloseMission = {() => setMissionOpened(false)}
      project={project}
    />
  );
}