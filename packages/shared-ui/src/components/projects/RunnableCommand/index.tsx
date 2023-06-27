import { CustomButton } from '../../Button';
import { BookIcon } from '../../icons/BookIcon';
import { CloseIcon } from '../../icons/CloseIcon';
import { HomeIcon } from '../../icons/HomeIcon';
import { ProfileIcon } from '../../icons/ProfileIcon';
import './styles.css';

export enum RunnableCommandStatus {
  Idle = 'Idle',
  Loading = 'Loading',
  Running = 'Running',
}

export interface RunnableCommandProps {
  label: string;
  status: RunnableCommandStatus,
  onPlay: () => void;
  onStop: () => void;
}

export function RunnableCommand(props: RunnableCommandProps) {
  const { label, status, onPlay, onStop } = props;
  return (
    <div className={`RunnableCommand ${status}`}>
      <div className={`RunnableCommand_icon`}>
        {status === RunnableCommandStatus.Idle && (
          <BookIcon width={16} height={16} />
        )}
        {status === RunnableCommandStatus.Loading && (
          <HomeIcon width={16} height={16} />
        )}
        {status === RunnableCommandStatus.Running && (
          <CloseIcon width={16} height={16} />
        )}
      </div>
      <div className="RunnableCommand_label">
        {label}
      </div>
      <div className="RunnableCommand_action">
        {status === RunnableCommandStatus.Idle && (
          <CustomButton
            label="play"
            size="small"
            variant='secondary'
            disabled={false}
            onClick={onPlay}
          />
        )}
        {status === RunnableCommandStatus.Running && (
          <button onClick={onStop}>stop</button>
        )}
      </div>
    </div>
  );
}