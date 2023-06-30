import { CustomButton } from "../../Button";

interface Props {
  label: string;
}

export function SidePanelTab(props: Props) {
  const { label } = props;
  return (
    <div className="inline-block">
      <CustomButton
        label={label}
        size="small"
        onClick={() => {}}
        variant="boldy"
      />
    </div>
  );
}
