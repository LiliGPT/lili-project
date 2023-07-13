import { ReduxCoreView, ReduxLoadingStatus, createMissionThunk, platformSignInThunk, selectCoreView, selectMissionExecution, store, useAppDispatch, useAppSelector, useComponentDidMount, useKeyboardShortcuts, useQueryString } from '@lili-project/lili-store';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { ExecutionItem } from '../components/missions/ExecutionItem';
import { MissionActionsSidePanel } from '../components/SidePanel/MissionActionsSidePanel';

interface Props {
  project_dir: string;
  message: string;
}

export function ExternalMissionPopup(props: Props) {
  return (
    <Provider store={store}>
      <MissionPopupInnerContent {...props} />
    </Provider>
  );
}

function MissionPopupInnerContent({ project_dir, message }: Props) {
  const dispatch = useAppDispatch();
  const [executionId, setExecutionId] = useState('');
  const execution = useAppSelector(selectMissionExecution(executionId));
  
  useComponentDidMount(async () => {
    await dispatch(platformSignInThunk())
    await dispatch(createMissionThunk({
      message,
      project_dir,
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
  });

  if (!execution || execution.loading_status === ReduxLoadingStatus.Loading) {
    return (
      <div>loading...</div>
    );
  }

  return (<div className="flex flex-row">
    <div className="w-1/3 h-screen">
      <ExecutionItem
        execution={execution}
        canToggleEditMode={true}
        defaultEditMode={true}
        hideProjectName={true}
        canRetry={true}
        vertical={true}
      />
    </div>
    <div className="flex flex-1 items-stretch self-stretch">
      <MissionActionsSidePanel />
    </div>
  </div>);
}
