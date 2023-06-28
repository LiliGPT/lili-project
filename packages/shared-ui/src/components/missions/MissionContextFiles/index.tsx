import { MissionExecutionStatus, ReduxMissionExecution, useAppDispatch } from "@lili-project/lili-store";

interface Props {
  execution: ReduxMissionExecution;
  editMode: boolean;
}

export function MissionContextFiles(props: Props) {
  const {
    execution: {
      data: executionData,
    },
    editMode,
  } = props;
  const dispatch = useAppDispatch();

  const canAddFiles = editMode && executionData?.execution_status === MissionExecutionStatus.Created
    || executionData?.execution_status === MissionExecutionStatus.Approved;

  const onClickAdd = async () => {
    // await rustAddContextFiles(
    //   executionData?.mission_data.project_dir,
    //   executionData?.execution_id,
    // );
    // await dispatch(fetchExecutionsThunk());
  };

  return (
    <>
      {canAddFiles && (
        <span className="float-right mt-1 text-slate-300 hover:text-slate-400 cursor-pointer" onClick={onClickAdd}>
          {/* <AddCircleOutline fontSize="small" /> */}
          + add
        </span>
      )}
      <div className="mt-2 mb-1 text-xs">context files</div>
      <div className="p-2 rounded py-1 px-2 bg-primary text-xs">
        {executionData?.context_files.map((file, index) => (
          <div key={`file-${index}`}>
            <div className="">{file.path}</div>
          </div>
        ))}
      </div>
    </>
  );
}
