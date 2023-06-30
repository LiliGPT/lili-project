import { selectShellTask, useAppSelector } from '@lili-project/lili-store';
import { CustomButton } from '../../Button';
import { BookIcon } from '../../icons/BookIcon';
import { CloseIcon } from '../../icons/CloseIcon';
import { HomeIcon } from '../../icons/HomeIcon';
import './styles.css';

export interface RunnableCommandProps {
  label: string;
  project_id: string;
  command: string;
  onPlay: () => Promise<void>;
  onStop: () => Promise<void>;
}

export function RunnableCommand(props: RunnableCommandProps) {
  const { label, project_id, command, onPlay, onStop } = props;
  const task = useAppSelector(selectShellTask({
    project_id,
    command,
  }));
  const status = task?.is_running ? 'Running' : 'Idle';
  const is_running = task?.is_running;
  return (
    <div className={`RunnableCommand ${status}`}>
      <div className={`RunnableCommand_icon`}>
        {is_running && (
          <HomeIcon width={16} height={16} />
        )}
        {!is_running && (
          <CloseIcon width={16} height={16} />
        )}
      </div>
      <div className="RunnableCommand_label">
        {label}
      </div>
      <div className="RunnableCommand_action">
        <CustomButton
          label="play"
          size="small"
          variant='secondary'
          disabled={is_running}
          onClick={onPlay}
        />
        <CustomButton
          label="stop"
          size="small"
          variant='secondary'
          disabled={!is_running}
          onClick={onStop}
        />
      </div>
    </div>
  );
}
