import { useCallback, useState } from "react";
import { ExecutionActionItem } from "./ExecutionActionItem";
import { MissionAction, ReduxMissionExecution, removeExecutionActionThunk, toggleSelectedExecutionAction, useAppDispatch } from "@lili-project/lili-store";

interface Props {
  execution: ReduxMissionExecution;
  canDelete: boolean;
  // onClickDelete?: ((action: ExecutionAction) => Promise<void>);
}

export function ExecutionActions(props: Props) {
  const { execution, canDelete } = props;
  // const [action, setAction] = useState<MissionAction | null>(null);
  const dispatch = useAppDispatch();
  const executionData = execution.data;

  const onClickDelete = (action_path: string) => !canDelete ? undefined : async () => {
    await dispatch(removeExecutionActionThunk({
      action_path,
      execution_id: execution.entity_id,
    }));
  };

  const onClickActionItem = (action: MissionAction) => () => {
    dispatch(toggleSelectedExecutionAction({
      execution_id: execution.entity_id,
      action_path: action.path,
    }));
  };

  const isSelectedAction = (action: MissionAction) => {
    return false;
  };

  if (!executionData) {
    return (
      <div>
        error: no execution data
      </div>
    );
  }

  const actions: MissionAction[] = executionData.reviewed_actions ?? executionData.original_actions ?? [];

  return (
    <div className="pt-3 pb-4">
      {actions.map((action, index) => <ExecutionActionItem
        key={`${executionData.execution_id}-act-${index}`}
        execution_id={executionData.execution_id}
        is_selected={isSelectedAction(action)}
        onClick={onClickActionItem(action)}
        onClickDelete={onClickDelete(action.path)}
        {...action}
      />)}
      {/*
      <ExecutionActionDialog
        open={action !== null}
        onClose={() => setAction(null)}
        action={action}
        contextFiles={execution.context_files}
      />
      */}
    </div>
  );
}
