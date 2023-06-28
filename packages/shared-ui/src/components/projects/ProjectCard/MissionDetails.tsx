import { ReduxCodeProject, ReduxLoadingStatus, ReduxMissionExecution, createMissionThunk, selectMissionError, selectMissionExecutions, selectMissionLoading, useAppDispatch, useAppSelector } from '@lili-project/lili-store';
import { TextInput } from "../../TextInput";
import { Spacer } from "../../layout/Spacer";
import './MissionDetails.styles.css';
import { useState } from 'react';

export type MissionDetails_OnClickGenerate = (project: ReduxCodeProject, message: string, execution?: ReduxMissionExecution) => void;

interface Props {
  project: ReduxCodeProject;
  execution?: ReduxMissionExecution;
  onClickGenerate: MissionDetails_OnClickGenerate;
}

export function MissionDetails(props: Props) {
  const { project, execution, onClickGenerate } = props;
  
  const [message, setMessage] = useState('');
  const status = execution?.loading_status;
  const error = execution?.error;

  const onClickGenerateWrapper = () => {
    onClickGenerate(project, message);
  };
  
  return (
    <div className="MissionDetails">
      <Spacer />
      {status === ReduxLoadingStatus.Loading && (
        <div>loading...</div>
      )}
      {status === ReduxLoadingStatus.Error && !!error && (
        <div className="p-2 text-sm text-red-500">{error.error_description}</div>
      )}
      {status === ReduxLoadingStatus.Success && !!execution && (
        <pre className="text-white text-xs">{JSON.stringify(execution, null, 2)}</pre>
      )}
      <div className="MissionDetails_InputWrapper">
        <TextInput
          label="Mission description"
          value={message}
          onChange={(v) => setMessage(v)}
          action={{
            label: 'Generate',
            onClick: onClickGenerateWrapper,
            loading: status === ReduxLoadingStatus.Loading,
          }}
          multiline
        />
      </div>
    </div>
  )
}