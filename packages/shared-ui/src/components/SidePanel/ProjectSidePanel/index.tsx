import { MissionExecution, PrompterClient, ReduxLoadingStatus, ReduxMissionExecution, fetchMissionExecutionsThunk, refreshTokenThunk, selectMissionError, selectMissionExecutions, selectMissionLoading, selectMissionSliceError, selectMissionSliceLoadingStatus, selectOpenedProjects, selectOpenedRootProject, useAppDispatch, useAppSelector } from "@lili-project/lili-store";
import { useEffect, useState } from "react";
import { ExecutionItem } from "../../missions/ExecutionItem";
import { CustomButton } from "../../Button";

interface Props { }

export function ProjectSidePanel(props: Props) {
  // const {  } = props;
  const dispatch = useAppDispatch();
  const project = useAppSelector(selectOpenedRootProject());
  const project_dir = project?.data?.project_dir;
  const contentComponents: JSX.Element[] = [];
  const executions = useAppSelector(selectMissionExecutions());
  const error = useAppSelector(selectMissionSliceError());
  const loadingStatus = useAppSelector(selectMissionSliceLoadingStatus());

  // get current filters
  const getFilters = () => {
    const filters = {
      "mission_data.project_dir": project_dir,
    };
    return { filters };
  };

  // refresh executions on project change
  useEffect(() => {
    dispatch(fetchMissionExecutionsThunk(getFilters()));
  }, [project_dir]);

  const onClickRefreshLastExecutions = () => {
    dispatch(fetchMissionExecutionsThunk(getFilters()));
  };

  if (!project_dir) {
    return null;
  }

  if (loadingStatus === ReduxLoadingStatus.Error) {
    contentComponents.push(
      <div className="bg-red-500 text-white rounded-xl py-2 px-3" key="error">
        <h1>Error</h1>
        <p>{JSON.stringify(error, null, 2)}</p>
      </div>
    );
  }

  if (loadingStatus === ReduxLoadingStatus.Loading) {
    contentComponents.push(
      <div className="rounded-full h-16 w-16 border-2 border-t-2 border-accent animate-spin" key="loading" />
    );
  }

  if (loadingStatus === ReduxLoadingStatus.Success) {
    contentComponents.push(
      <div className="bg-primary py-2 px-3 rounded-xl text-left flex flex-col gap-2" key="success">
        <h2 className="text-left">
          Last Executions
          <CustomButton
            label="Refresh"
            onClick={onClickRefreshLastExecutions}
            size="small"
            variant="boldy"
          />
        </h2>
        {executions.map((execution) => {
          return (
            <ExecutionItem
              key={execution.entity_id}
              execution={execution}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-primary py-2 px-0 rounded-xl text-left">
      <h1>ProjectSidePanel</h1>
      {contentComponents}
    </div>
  );
}

