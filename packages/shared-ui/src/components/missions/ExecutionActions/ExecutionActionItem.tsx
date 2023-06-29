import { MissionAction, useAppDispatch } from "@lili-project/lili-store";
import { CustomButton } from "../../Button";

interface Props extends MissionAction {
  execution_id: string;
  onClick: () => void;
  onClickDelete: undefined | (() => Promise<void>);
}

export function ExecutionActionItem(props: Props) {
  const { execution_id, onClick, onClickDelete } = props;
  const dispatch = useAppDispatch();

  return (
    <div className="my-1 w-full flex flex-row items-center">
      <div onClick={props.onClick} className="rounded flex-grow py-1 px-2 bg-primary text-xs cursor-pointer">
        {props.action_type} - {props.path}
      </div>
      {!!onClickDelete && (
        <div
          className="text-red-700 rounded -mr-1 py-0.5 px-0 opacity-70"
        >
          <CustomButton
            onClick={onClickDelete}
            size="small"
            label="delete"
            variant="danger"
          />
        </div>
      )}
    </div>
  )
}
