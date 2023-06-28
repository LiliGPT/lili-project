import { MissionExecutionStatus, ReduxMissionExecution } from "@lili-project/lili-store";
import { CustomButton } from "../../Button";
import { BookIcon } from "../../icons/BookIcon";
import { SettingsDropdownButton } from "../../SettingsDropdownMenu";
import { MissionContextFiles } from "../MissionContextFiles";

interface Props {
  execution: ReduxMissionExecution;
  loading: boolean;
  editionMode: boolean;
  setEditionMode: (editionMode: boolean) => void;
  canOpenSettings: boolean;
  settingsActions: { [key: string]: () => void };
  canSetFail: boolean;
  canSetPerfect: boolean;
  onClickFail: () => void;
  onClickSetPerfect: () => void;
  canToggleEditMode?: boolean;
  hideProjectName?: boolean;
  hideMessage?: boolean;
}

export function ExecutionItemLayout(props: Props) {
  const { execution, loading, editionMode, setEditionMode, canOpenSettings, settingsActions, canSetFail, canSetPerfect, onClickFail, onClickSetPerfect, hideProjectName, hideMessage, } = props;
  const canToggleEditMode = props.canToggleEditMode ?? true;
  const executionData = execution.data;
  // --- settings dropdown
  const settingsDropdownMenu = canOpenSettings && (
    <SettingsDropdownButton
      menuOptions={Object.keys(settingsActions)}
      callbacks={Object.values(settingsActions)}
    />
  );
  // --- toggle edit mode
  let editModeIconButton;
  if (!loading && executionData?.execution_status !== MissionExecutionStatus.Fail && canToggleEditMode) {
    editModeIconButton = !editionMode ? (
      <div className="absolute top-1 right-2">
        <div onClick={() => setEditionMode(true)}>
          <BookIcon width={16} height={16} fill={'#ccc'} />
        </div>
      </div>
    ) : (
      <div className="absolute top-1 right-2">
        <div onClick={() => setEditionMode(false)}>
          <BookIcon width={16} height={16} fill={'#ccc'} />
        </div>
      </div>
    );
  }

  // --- buttons
  const setFailButton = !loading && canSetFail && (
    <CustomButton
      label="set fail"
      onClick={onClickFail}
      size="small"
      variant='danger'
    />
  );
  const setPerfectButton = canSetPerfect && (
    <CustomButton
      label="set perfect"
      onClick={onClickSetPerfect}
      size="small"
      variant='primary'
    />
  );
  const approveAndRunButton = !loading && editionMode && executionData?.execution_status === MissionExecutionStatus.Created && (
    <CustomButton
      label="approve and run"
      onClick={() => { /** */ }}
      size="small"
      variant='boldy'
    />
  );

  const className = (hideProjectName || hideMessage) ? `pt-2 pb-2` : `pt-1 pb-2`;

  return (
    <div
      className={`relative border rounded-md px-2 ${className} bg-tertiary border-tertiary text-xs`}
      key={executionData?.execution_id}
    >
      {editModeIconButton}
      
      {!hideProjectName && (
        <div className="mb-2 text-xs">{executionData?.mission_data.project_dir.split('/').pop()}</div>
      )}
      {!hideMessage && (
        <div className="text-sm">{executionData?.mission_data.message}</div>
      )}
      <div className="text-xs text-slate-500 flex flex-row">
        {executionData?.execution_status} ({executionData?.execution_id})
        {setFailButton}
        {approveAndRunButton}
        {setPerfectButton}
        <div className="flex-grow text-right -mt-1">
          {settingsDropdownMenu}
        </div>
      </div>
      {/* <MissionActions
        execution={execution}
        canDelete={!loading && editionMode}
      />
      */}
      <MissionContextFiles
        execution={execution}
        editMode={editionMode}
      />
    </div>
  );
}
