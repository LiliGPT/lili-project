import { ReduxLoadingStatus, fetchMissionExecutionsThunk, selectMissionExecutions, selectMissionSliceError, selectMissionSliceLoadingStatus, selectOpenedRootProject, useAppDispatch, useAppSelector } from "@lili-project/lili-store";
import { useEffect } from "react";
import { CustomButton } from "../../Button";
import { ExecutionItem } from "../ExecutionItem";

export function LastExecutions() {
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
      <div className="text-gray-500 text-center rounded-xl py-5" key="error">
        Not possible to list executions for this project
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
      <div className="CardBoxContent bg-primary rounded-xl text-left flex flex-col gap-2" key="success">
        <h2 className="text-left text-sm leading-10 mb-4">
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
    <>{contentComponents}</>
  );
}

