import { GitChangeType, GitStatusEntry } from "@lili-project/lili-store";
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

  const fileColor = (file: GitStatusEntry) => {
    if (!file.is_staged) {
      return 'text-red-500';
    }
    if (file.is_staged && file.change_type === GitChangeType.Modified) {
      return 'text-yellow-400';
    }
    if (file.is_staged && file.change_type === GitChangeType.Added) {
      return 'text-green-400';
    }
    if (file.is_staged && file.change_type === GitChangeType.Deleted) {
      return 'text-red-500';
    }
    return 'text-slate-400';
  }

  return (
    <div
      onMouseOut={delayedClose}
      className="flex flex-col py-2 border border-slate-600 min-h-[220px]"
    >
      {files.map((file: GitStatusEntry) => {
        return (
          <div
            key={file.file_path}
            className={`${fileColor(file)} text-opacity-60 text-sm leading-8 hover:bg-cyan-900 hover:text-white transition-colors duration-400 px-2 cursor-pointer`}
            onMouseOver={onFileMouseOverFn(file.file_path)}
          >
            {file.file_path}
          </div>
        );
      })}
    </div>
  );
}

