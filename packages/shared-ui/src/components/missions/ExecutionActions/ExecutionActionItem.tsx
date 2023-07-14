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
  const labelClassName = is_selected ? 'bg-secondary text-white' : 'bg-primary';

  return (
    <div className="my-1 w-full flex flex-row items-center relative overflow-hidden">
      <div
        onClick={props.onClick}
        className={`rounded flex-grow py-1 px-2 text-xs leading-6 cursor-pointer ${labelClassName} flex flex-row relative overflow-hidden text-slate-500`}
      >
        <div className="flex-none">
          {props.action_type[0]}
        </div>
        <div className="flex-1 overflow-hidden relative ml-3">
          &nbsp;
          <div className="text-right absolute top-1/2 right-0 -translate-y-1/2 pr-2">
            {props.path}
          </div>
        </div>
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
