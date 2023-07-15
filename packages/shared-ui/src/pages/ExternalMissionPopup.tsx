import { ReduxCoreView, ReduxLoadingStatus, approveAndRunExecutionThunk, createMissionThunk, platformSignInThunk, selectCoreView, selectCurrentUser, selectMissionExecution, selectMissionLoading, selectNextExecutionActionSingle, selectPreviousExecutionActionSingle, setExecutionFailThunk, store, useAppDispatch, useAppSelector, useComponentDidMount, useKeyboardShortcuts, useQueryString } from '@lili-project/lili-store';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { ExecutionItem } from '../components/missions/ExecutionItem';
import { MissionActionsSidePanel } from '../components/SidePanel/MissionActionsSidePanel';
import { CustomButton } from '../components/Button';
import { SignInForm } from '../components/auth/SignInForm';

interface Props {
  project_dir: string;
  message: string;
  afterSetFail?: () => Promise<void>;
  afterApprove?: () => Promise<void>;
  afterRetry?: () => Promise<void>;
}

export function ExternalMissionPopup(props: Props) {
  return (
    <Provider store={store}>
      <ExternalMissionPopupContent {...props} />
    </Provider>
  );
}

function ExternalMissionPopupContent(props: Props) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser());

  useComponentDidMount(async () => {
    await dispatch(platformSignInThunk());
  });

  if (!user?.sub) {
    return <SignInPopup />;
  }

  return <MissionPopupInnerContent {...props} />;
}

function SignInPopup() {
  return (
    <div className="fixed top-5 right-5 bg-primary shadow-md p-4 w-96">
      <SignInForm />
    </div>
  );
}

function MissionPopupInnerContent({
  project_dir,
  message,
  afterSetFail,
  afterApprove,
  afterRetry,
}: Props) {
  const dispatch = useAppDispatch();
  const [executionId, setExecutionId] = useState('');
  const execution = useAppSelector(selectMissionExecution(executionId));
  const loading = useAppSelector(selectMissionLoading(executionId));
  
  useComponentDidMount(async () => {
    await dispatch(createMissionThunk({
      message,
      project_dir,
    })).unwrap().then((execution) => {
      if (!execution.data) {
        console.error(
          '[ExternalMissionPopup.tsx @ onClickGenerate] no execution data.',
          'This should never happen since this execution was just created.',
          { execution }
        );
        // todo: show error
        return;
      }
      setExecutionId(execution.data?.execution_id);
      dispatch(selectNextExecutionActionSingle({ execution_id: execution.data?.execution_id }));
    });
  });

  const onSetFail = async () => {
    await dispatch(setExecutionFailThunk(executionId));
    if (afterSetFail) await afterSetFail();
  };

  const onApprove = async () => {
    await dispatch(approveAndRunExecutionThunk({
      project_dir,
      execution_id: executionId,
    }));
    if (afterApprove) await afterApprove();
  };

  useKeyboardShortcuts({
    "Escape": async () => {
      await onSetFail();
    },
    "r": async () => {
      await onApprove();
    },
    "ArrowUp": async () => {
      await dispatch(selectPreviousExecutionActionSingle({ execution_id: executionId }));
    },
    "ArrowDown": async () => {
      await dispatch(selectNextExecutionActionSingle({ execution_id: executionId }));
    },
  }, [executionId], true);

  if (!execution) {
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

  const isLoading = loading === ReduxLoadingStatus.Loading;

  return (<div className="fixed right-5 h-screen flex flex-col items-end gap-5">
    <div className="w-96 flex flex-col">
      <CuteNotification>
        {message}
      </CuteNotification>
      {isLoading && (
        <CuteNotification>
          loading...
        </CuteNotification>
      )}
      {!isLoading && (<ExecutionItem
        execution={execution}
        canToggleEditMode={false}
        hideMessage={true}
        defaultEditMode={true}
        hideProjectName={true}
        canRetry={true}
        vertical={true}
        selectSingleAction={true}
        afterSetFail={afterSetFail}
        afterApprove={afterApprove}
        afterRetry={afterRetry}
      />)}
    </div>
    {!isLoading && (
      <div className="w-96 flex flex-row gap-2">
        <CustomButton
          label="[Esc] Close"
          size='medium'
          variant='danger'
          onClick={onSetFail}
          fullWidth
        />
        <CustomButton
          label="[r] Approve and Run"
          size='medium'
          variant='boldy'
          onClick={onApprove}
          fullWidth
        />
      </div>
    )}
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