import { MissionExecutionStatus, ReduxMissionExecution, useAppDispatch } from '@lili-project/lili-store';
import './ExecutionItem.styles.css';
import { useState } from 'react';
import { BookIcon } from '../../icons/BookIcon';
import { CustomButton } from '../../Button';
import { SettingsDropdownButton } from '../../SettingsDropdownMenu';
import { ExecutionItemLayout } from './ExecutionItem.layout';

interface Props {
  execution: ReduxMissionExecution;
  defaultEditMode?: boolean;
  canToggleEditMode?: boolean;
  canRetry?: boolean;
  hideProjectName?: boolean;
  hideMessage?: boolean;
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
    // await dispatch(deleteExecutionThunk(execution.execution_id));
    setLoading(false);
    if (canToggleEditMode) {
      setEditionMode(false);
    }
  };

  const onClickSetPerfect = async () => {
    setLoading(true);
    // await rustExecutionSetPerfect(execution.execution_id);
    // await dispatch(fetchExecutionsThunk());
    setLoading(false);
    if (canToggleEditMode) {
      setEditionMode(false);
    } 
  };

  const onClickRetryMission = async () => {
    setLoading(true);
    // await dispatch(retryExecutionThunk(execution.execution_id, execution.mission_data.message));
    // TODO: should we run the new actions locally?
    setLoading(false);
    if (canToggleEditMode) {
      setEditionMode(false);
    }
  };

  const onClickApproveAndRun = async () => {
    setLoading(true);
    // await dispatch(approveAndRunExecutionThunk(execution.mission_data.project_dir, execution.execution_id));
    setLoading(false);
    if (canToggleEditMode) {
      setEditionMode(false);
    }
  };

  const onClickCommitLocalFiles = async () => {
    setLoading(true);
    // await dispatch(commitExecutionLocalChangesThunk(execution.mission_data.project_dir, execution.execution_id));
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
  />
}
