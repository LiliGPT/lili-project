import { MissionExecutionStatus, ReduxCodeProject, ReduxLoadingStatus, ReduxMissionExecution, createMissionThunk, selectMissionError, selectMissionExecutions, selectMissionLoading, useAppDispatch, useAppSelector } from '@lili-project/lili-store';
import { TextInput } from "../../TextInput";
import { Spacer } from "../../layout/Spacer";
import './MissionDetails.styles.css';
import { useState } from 'react';
import { ExecutionItem } from '../../missions/ExecutionItem';

export type MissionDetails_OnClickGenerate = (project: ReduxCodeProject, message: string, execution?: ReduxMissionExecution) => void;

export type MissionDetails_OnClickRetry = (project: ReduxCodeProject, message: string, execution: ReduxMissionExecution) => void;

interface Props {
  project: ReduxCodeProject;
  execution?: ReduxMissionExecution;
  onClickGenerate: MissionDetails_OnClickGenerate;
  onClickRetry: MissionDetails_OnClickRetry;
}

export function MissionDetails(props: Props) {
  const { project, execution, onClickGenerate } = props;
  
  const [message, setMessage] = useState('');
  const status = execution?.loading_status;
  const error = execution?.error;

  const isNewlyCreated = execution?.data?.execution_status === MissionExecutionStatus.Created;

  const onClickGenerateWrapper = () => {
    onClickGenerate(project, message);
  };

  const onClickRetryWrapper = () => {
    // 
  }
  
  return (
    <div className="MissionDetails">
      {status === ReduxLoadingStatus.Loading && (
        <>
          <Spacer />
          <div>loading...</div>
        </>
      )}
      {status === ReduxLoadingStatus.Error && !!error && (
        <>
          <Spacer />
          <div className="p-2 text-sm text-red-500">{error.error_description}</div>
        </>
      )}
      {status === ReduxLoadingStatus.Success && !!execution && (
        <div className="py-2 px-3">
          <ExecutionItem
            defaultEditMode={true}
            canToggleEditMode={false}
            execution={execution}
            canRetry={false}
            hideProjectName
            hideMessage
          />
        </div>
      )}
      {(
        status !== ReduxLoadingStatus.Success
        || isNewlyCreated
      ) && (
        <>
          <Spacer />
          <div className="MissionDetails_InputWrapper">
            <TextInput
              label="Mission description"
              value={message}
              onChange={(v) => setMessage(v)}
              action={{
                label: !isNewlyCreated ? 'Generate' : 'Retry',
                onClick: !isNewlyCreated ? onClickGenerateWrapper : onClickRetryWrapper,
                loading: status === ReduxLoadingStatus.Loading,
              }}
              multiline
            />
          </div>
        </>
      )}
    </div>
  )
}
