import { GitFileChange } from "../types";

interface Props {
  files: GitFileChange[];
}

export function GitFilesPicker(props: Props) {
  const { files } = props;

  return (
    <div className="flex flex-col p-2 border border-slate-600">
      {files.map((file: GitFileChange) => {
        return (
          <div
            key={file.path}
          >
            {file.path}
          </div>
        );
      })}
    </div>
  );
}

