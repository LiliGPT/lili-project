import { MissionExecutionStatus, ReduxMissionExecution } from "@lili-project/lili-store";
import { CustomButton } from "../../Button";
import { BookIcon } from "../../icons/BookIcon";
import { SettingsDropdownButton } from "../../SettingsDropdownMenu";
import { MissionContextFiles } from "../MissionContextFiles";
import { ExecutionActions } from "../ExecutionActions";

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
  onClickApproveAndRun: () => void;
  canToggleEditMode?: boolean;
  hideProjectName?: boolean;
  hideMessage?: boolean;
  vertical?: boolean;
  selectSingleAction?: boolean;
}

export function ExecutionItemLayout(props: Props) {
  const { execution, loading, editionMode, setEditionMode, canOpenSettings, settingsActions, canSetFail, canSetPerfect, onClickFail, onClickSetPerfect, onClickApproveAndRun, hideProjectName, hideMessage, vertical, selectSingleAction } = props;
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
      onClick={onClickApproveAndRun}
      size="small"
      variant='boldy'
    />
  );

  let className = (hideProjectName || hideMessage)
    ? `pt-2 pb-2` : `pt-1 pb-2`;

  if (vertical) {
    className += ` flex flex-col px-1 shadow-lg shadow-[#141414]`;
    className += ` border border-t-slate-700 border-r-slate-700 border-b-slate-700`;
  } else {
    className += ' px-6';
  }
  
  const estatus = executionData?.execution_status;
  if (estatus === MissionExecutionStatus.Fail) {
    className += ` border-l-4 border-red-900 border-opacity-70`;
  } else if (estatus === MissionExecutionStatus.Created) {
    className += ` border-l-4 border-cyan-600 border-opacity-60`;
  } else if (estatus === MissionExecutionStatus.Perfect) {
    className += ` border-l-4 border-violet-600 border-opacity-60`;
  }

  return (
    <div
      className={`relative rounded-md ${className} bg-slate-800 text-xs`}
      key={executionData?.execution_id}
    >
      {editModeIconButton}

      <div className={`flex flex-row justify-between gap-5`}>
        {!hideProjectName && (
          <div className="flex-shrink mb-2 text-xs text-slate-600">{executionData?.mission_data.project_dir.split('/').pop()}</div>
        )}
        <div className="flex-1 text-slate-600">
          #{executionData?.execution_id}
        </div>
        {!vertical && (
          <>
            <div className="flex-1"></div>
            <div className="flex-shrink text-slate-600">
              {executionData?.execution_status}
            </div>
          </>
        )}
      </div>
      {!hideMessage && (
        <div className={`text-slate-400 ${vertical ? 'text-[18px] leading-6' : 'text-lg'}`}>{executionData?.mission_data.message}</div>
      )}
      <div className="text-xs text-slate-500 flex flex-row">
        {setFailButton}
        {approveAndRunButton}
        {setPerfectButton}
        <div className="flex-grow text-right -mt-1">
          {settingsDropdownMenu}
        </div>
      </div>
      <div className={vertical ? `flex flex-col h-full` : `flex flex-row gap-10`}>
        <div className="flex-shrink">
          <ExecutionActions
            execution={execution}
            canDelete={!loading && editionMode}
            selectSingleAction={selectSingleAction}
          />
        </div>
        <div className="flex-1">
          <MissionContextFiles
            execution={execution}
            editMode={editionMode}
          />
        </div>
      </div>
    </div>
  );
}
