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
      <div
        className="fixed top-0 right-5 w-96"
      >
        <CuteNotification>
          <div className="text-sm mb-2 text-slate-700">loading...</div>
          <div className="">{message}</div>
        </CuteNotification>
      </div>
    );
  }

  return (<div className="fixed right-5 h-screen flex flex-col items-end gap-5">
    <div className="w-96 flex flex-col">
      <CuteNotification>
        {message}
      </CuteNotification>
      <ExecutionItem
        execution={execution}
        canToggleEditMode={false}
        hideMessage={true}
        defaultEditMode={true}
        hideProjectName={true}
        canRetry={true}
        vertical={true}
        selectSingleAction={true}
      />
    </div>
    <div className="w-[600px] flex flex-col flex-1 self-stretch items-stretch pb-28">
      <MissionActionsSidePanel />
    </div>
  </div>);
}

function CuteNotification({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-5 bg-boldy px-8 py-4 rounded-md shadow-md shadow-[#141414] text-slate-100 border border-slate-800">
      {children}
    </div>
  );
}