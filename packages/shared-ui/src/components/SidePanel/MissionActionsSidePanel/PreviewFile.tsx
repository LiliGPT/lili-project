import { useState } from "react";
import { CustomButton } from "../../Button";

interface Props {
  original_content?: string;
  content: string;
}

export function PreviewFile(props: Props) {
  const [showOriginal, setShowOriginal] = useState(false);

  const onClickNewVersion = () => {
    setShowOriginal(false);
  };

  const onClickOriginal = () => {
    if (props.original_content) {
      setShowOriginal(true);
    }
  };

  const buttons = (
    <div className="pb-2 flex flex-row gap-2">
      <CustomButton
        label="Original"
        size="medium"
        variant={showOriginal ? "accent" : "secondary"}
        disabled={!props.original_content}
        onClick={onClickOriginal}
      />
      <CustomButton
        label="New Version"
        size="medium"
        variant={showOriginal ? "secondary" : "accent"}
        onClick={onClickNewVersion}
      />
    </div>
  );

  return (
    <div className="py-2">
      {buttons}
      <div className="text-xs h-60 p-2 bg-tertiary overflow-y-auto rounded-lg text-slate-300">
        <pre>{
          showOriginal ?
            props.original_content :
            props.content
        }</pre>
      </div>
    </div>
  );
}
