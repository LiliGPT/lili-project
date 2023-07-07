import { MissionExecution, PrompterClient, ReduxLoadingStatus, ReduxMissionExecution, refreshTokenThunk, selectOpenedProjects, selectOpenedRootProject, useAppDispatch, useAppSelector } from "@lili-project/lili-store";
import { useEffect, useState } from "react";
import { ExecutionItem } from "../../missions/ExecutionItem";

interface Props {

}

interface State {
  executions: ReduxMissionExecution[];
  loadingStatus: ReduxLoadingStatus;
  error?: string;
}

export function ProjectSidePanel(props: Props) {
  // const {  } = props;
  const dispatch = useAppDispatch();
  const project = useAppSelector(selectOpenedRootProject());
  const project_dir = project?.data?.project_dir;
  const contentComponents: JSX.Element[] = [];

  const [state, setState] = useState<State>({
    executions: [],
    loadingStatus: ReduxLoadingStatus.Idle,
    error: undefined,
  });

  useEffect(() => {
    async function searchExecutions(project_dir?: string) {
      if (!project_dir || state.loadingStatus !== ReduxLoadingStatus.Idle) {
        return;
      }

      setState(currentState => ({
        ...currentState,
        loadingStatus: ReduxLoadingStatus.Loading,
        error: undefined,
      }));

      await dispatch(refreshTokenThunk());
      PrompterClient.searchExecutions({
        "mission_data.project_dir": project_dir,
      }).then((rawExecutions) => {
        const executions: ReduxMissionExecution[] = rawExecutions.map((rawExecution) => {
          return {
            data: rawExecution,
            entity_id: rawExecution.execution_id,
            error: null,
            loading_status: ReduxLoadingStatus.Success,
            selected_actions_paths: [],
          };
        });
        setState(currentState => ({
          ...currentState,
          loadingStatus: ReduxLoadingStatus.Success,
          executions,
          error: undefined,
        }));
      }).catch((error) => {
        setState(currentState => ({
          ...currentState,
          loadingStatus: ReduxLoadingStatus.Error,
          executions: [],
          error: String(error),
        }));
      });
    }
    searchExecutions(project_dir);
  }, [project_dir, dispatch, state.loadingStatus]);

  if (!project_dir) {
    return null;
  }

  if (state.loadingStatus === ReduxLoadingStatus.Error) {
    contentComponents.push(
      <div className="bg-red-500 text-white rounded-xl py-2 px-3" key="error">
        <h1>Error</h1>
        <p>{state.error}</p>
      </div>
    );
  }

  if (state.loadingStatus === ReduxLoadingStatus.Loading) {
    contentComponents.push(
      <div className="rounded-full h-16 w-16 border-2 border-t-2 border-accent animate-spin" key="loading" />
    );
  }

  if (state.loadingStatus === ReduxLoadingStatus.Success) {
    contentComponents.push(
      <div className="bg-primary py-2 px-3 rounded-xl text-left flex flex-col gap-2" key="success">
        <h2 className="text-left">Last Executions</h2>
        {state.executions.map((execution) => {
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

