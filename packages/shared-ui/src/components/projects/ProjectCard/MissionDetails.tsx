import { ReduxCodeProject, ReduxLoadingStatus, ReduxMissionExecution, createMissionThunk, selectMissionError, selectMissionExecutions, selectMissionLoading, useAppDispatch, useAppSelector } from '@lili-project/lili-store';
import { TextInput } from "../../TextInput";
import { Spacer } from "../../layout/Spacer";
import './MissionDetails.styles.css';
import { useState } from 'react';

interface Props {
  project: ReduxCodeProject;
  execution?: ReduxMissionExecution;
}

export function MissionDetails(props: Props) {
  const dispatch = useAppDispatch();
  const { project, execution } = props;
  const [message, setMessage] = useState('');
  const status = execution?.loading_status;
  const error = execution?.error;
  
  const onGenerateMission = () => {
    dispatch(createMissionThunk({
      message,
      project_dir: props.project.data.project_dir,
    }));
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
      <div className="MissionDetails_InputWrapper">
        <TextInput
          label="Mission description"
          value={message}
          onChange={(v) => setMessage(v)}
          action={{
            label: 'Generate',
            onClick: onGenerateMission,
          }}
          multiline
        />
      </div>
    </div>
  )
}