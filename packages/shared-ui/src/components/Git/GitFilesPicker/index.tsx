import { GitStatusEntry } from "@lili-project/lili-store";
import { useRef } from "react";

interface Props {
  files: GitStatusEntry[];
  onChange: (path: string) => void;
}

export function GitFilesPicker(props: Props) {
  const intervalRef = useRef(0);
  const { files } = props;

  const delayedClose = () => {
    intervalRef.current = window.setTimeout(() => {
      props.onChange('');
    }, 0);
  };

  const onFileMouseOverFn = (file_path: string) => () => {
    window.clearTimeout(intervalRef.current);
    props.onChange(file_path);
  };

  return (
    <div
      onMouseOut={delayedClose}
      className="flex flex-col p-2 border border-slate-600"
    >
      {files.map((file: GitStatusEntry) => {
        return (
          <div
            key={file.file_path}
            onMouseOver={onFileMouseOverFn(file.file_path)}
          >
            {file.file_path}
          </div>
        );
      })}
    </div>
  );
}

