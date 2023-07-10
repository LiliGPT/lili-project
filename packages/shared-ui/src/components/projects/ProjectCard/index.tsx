"use client";

import { CodeMission, PlatformClient, ReduxCodeProject, ReduxMissionExecution, createMissionThunk, retryExecutionThunk, selectMissionExecution, useAppDispatch, useAppSelector } from "@lili-project/lili-store";
import { ProjectCardLayout } from "./layout";
import { useState } from "react";
import { MissionDetails_OnClickGenerate, MissionDetails_OnClickRetry } from "./MissionDetails";

interface Props {
  project: ReduxCodeProject;
}

export function ProjectCard(props: Props) {
  const { project } = props;
  const dispatch = useAppDispatch();
  const [missionOpened, setMissionOpened] = useState(false);
  const [executionId, setExecutionId] = useState(`new-${project.data.project_dir}`);
  const execution = useAppSelector(selectMissionExecution(executionId));

  const onClickGenerateExecution: MissionDetails_OnClickGenerate = (project: ReduxCodeProject, message: string) => {
    dispatch(createMissionThunk({
      message,
      project_dir: props.project.data.project_dir,
    })).unwrap().then((execution) => {
      if (!execution.data) {
        console.error(
          '[ProjectCard/index.tsx @ onClickGenerate] no execution data.',
          'This should never happen since this execution was just created.',
          { execution }
        );
        // todo: show error
        return;
      }
      setExecutionId(execution.data?.execution_id);
    });
  };

  const onClickRetryExecution: MissionDetails_OnClickRetry = async (
    project: ReduxCodeProject,
    message: string,
    execution: ReduxMissionExecution,
  ) => {
    await dispatch(retryExecutionThunk({
      message,
      execution_id: executionId,
    }));
  };

  const onClickCloseMission = async () => {
    //
  };

  const onClickOpenTerminal = async () => {
    await PlatformClient.client()
      .openTerminal()
      .catch((err) => {
        console.error(
          '[ProjectCard/index.tsx @ onClickOpenTerminal] error opening terminal.',
          { err }
        );
      });
  };

  return (
    <ProjectCardLayout
      missionOpened={missionOpened}
      onClickOpenMission = {() => setMissionOpened(true)}
      onClickCloseMission = {() => setMissionOpened(false)}
      project={project}
      executionId={executionId}
      execution={execution}
      onClickGenerateExecution={onClickGenerateExecution}
      onClickRetryExecution={onClickRetryExecution}
      onClickOpenTerminal={onClickOpenTerminal}
    />
  );
}
