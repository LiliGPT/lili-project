import { MissionAction, useAppDispatch } from "@lili-project/lili-store";
import { CustomButton } from "../../Button";

interface Props extends MissionAction {
  execution_id: string;
  is_selected: boolean;
  onClick: () => void;
  onClickDelete: undefined | (() => Promise<void>);
}

export function ExecutionActionItem(props: Props) {
  const { execution_id, is_selected, onClick, onClickDelete } = props;
  const dispatch = useAppDispatch();
  const labelClassName = is_selected ? 'bg-secondary' : 'bg-primary';

  return (
    <div className="my-1 w-full flex flex-row items-center">
      <div onClick={props.onClick} className={`rounded flex-grow py-1 px-2 text-xs cursor-pointer ${labelClassName}`}>
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
