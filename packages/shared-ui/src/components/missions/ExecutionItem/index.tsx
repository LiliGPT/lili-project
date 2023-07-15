import { MissionExecutionStatus, ReduxMissionExecution, approveAndRunExecutionThunk, commitExecutionLocalChangesThunk, retryExecutionThunk, setExecutionFailThunk, setExecutionPerfectThunk, useAppDispatch } from '@lili-project/lili-store';
import './ExecutionItem.styles.css';
import { useState } from 'react';
import { BookIcon } from '../../icons/BookIcon';
import { CustomButton } from '../../Button';
import { SettingsDropdownButton } from '../../SettingsDropdownMenu';
import { ExecutionItemLayout } from './ExecutionItem.layout';

const emptyCallback = async () => {
  // pass
};

interface Props {
  execution: ReduxMissionExecution;
  defaultEditMode?: boolean;
  canToggleEditMode?: boolean;
  canRetry?: boolean;
  hideProjectName?: boolean;
  hideMessage?: boolean;
  messageForRetry?: string;
  vertical?: boolean;
  selectSingleAction?: boolean;
  afterSetFail?: typeof emptyCallback;
  afterApprove?: typeof emptyCallback;
  afterRetry?: typeof emptyCallback;
}

export function ExecutionItem(props: Props) {
  const {
    canToggleEditMode,
    defaultEditMode,
    execution: {
      data: executionData,
    },
    canRetry,
    hideProjectName,
    hideMessage,
    messageForRetry,
    vertical,
    selectSingleAction,
    afterSetFail = emptyCallback,
    afterApprove = emptyCallback,
    afterRetry = emptyCallback,
  } = props;
  const dispatch = useAppDispatch();
  const [editionMode, setEditionMode] = useState<boolean>(defaultEditMode || false);
  const [loading, setLoading] = useState<boolean>(false);

  const canSetFail = !loading && editionMode && (executionData?.execution_status === MissionExecutionStatus.Perfect
    || executionData?.execution_status === MissionExecutionStatus.Approved
    || executionData?.execution_status === MissionExecutionStatus.Created);
  const canSetPerfect = !loading && editionMode && (executionData?.execution_status === MissionExecutionStatus.Approved);
  const canOpenSettings = !loading && editionMode && (executionData?.execution_status === MissionExecutionStatus.Created
    || executionData?.execution_status === MissionExecutionStatus.Approved);

  const onClickFail = async () => {
    setLoading(true);
    if (executionData) {
      await dispatch(setExecutionFailThunk(executionData.execution_id));
    }
    setLoading(false);
    if (canToggleEditMode) {
      setEditionMode(false);
    }
    await afterSetFail();
  };

  const onClickSetPerfect = async () => {
    setLoading(true);
    if (executionData) {
      await dispatch(setExecutionPerfectThunk(executionData.execution_id));
    }
    setLoading(false);
    if (canToggleEditMode) {
      setEditionMode(false);
    }
  };

  const onClickRetryMission = async () => {
    setLoading(true);
    if (executionData) {
      const message = messageForRetry ?? executionData.mission_data.message;
      await dispatch(retryExecutionThunk({
        message,
        execution_id: executionData.execution_id,
      }));
    }
    // TODO: should we run the new actions locally?
    setLoading(false);
    if (canToggleEditMode) {
      setEditionMode(false);
    }
    await afterRetry();
  };

  const onClickApproveAndRun = async () => {
    setLoading(true);
    console.log('onClickApproveAndRun ', executionData);
    if (executionData) {
      await dispatch(approveAndRunExecutionThunk({
        execution_id: executionData.execution_id,
        project_dir: executionData.mission_data.project_dir,
      }));
    }
    setLoading(false);
    if (canToggleEditMode) {
      setEditionMode(false);
    }
    await afterApprove();
  };

  const onClickCommitLocalFiles = async () => {
    setLoading(true);
    // await dispatch(commitExecutionLocalChangesThunk(execution.mission_data.project_dir, execution.execution_id));
    if (executionData) {
      await dispatch(commitExecutionLocalChangesThunk({
        project_dir: executionData.mission_data.project_dir,
        execution_id: executionData.execution_id,
      }));
    }
    setLoading(false);
    if (canToggleEditMode) {
      setEditionMode(false);
    }
  };

  // --- settings dropdown
  let settingsActions: { [key: string]: () => void } = {
    'commit local files': onClickCommitLocalFiles,
  }
  if (executionData?.execution_status === MissionExecutionStatus.Created) {
    settingsActions = {
      'approve and run': onClickApproveAndRun,
      ...settingsActions,
    };

    if (canRetry ?? true) {
      settingsActions = {
        'retry mission': onClickRetryMission,
        ...settingsActions,
      };
    }
  }

  return <ExecutionItemLayout
    execution={props.execution}
    hideProjectName={hideProjectName}
    hideMessage={hideMessage}
    loading={loading}
    canToggleEditMode={canToggleEditMode}
    editionMode={editionMode}
    setEditionMode={setEditionMode}
    canOpenSettings={canOpenSettings}
    settingsActions={settingsActions}
    canSetFail={canSetFail}
    canSetPerfect={canSetPerfect}
    onClickFail={onClickFail}
    onClickSetPerfect={onClickSetPerfect}
    onClickApproveAndRun={onClickApproveAndRun}
    vertical={vertical}
    selectSingleAction={selectSingleAction}
  />
}
