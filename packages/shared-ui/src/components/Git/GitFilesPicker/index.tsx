import { GitStatusEntry } from "@lili-project/lili-store";

interface Props {
  files: GitStatusEntry[];
}

export function GitFilesPicker(props: Props) {
  const { files } = props;

  return (
    <div className="flex flex-col p-2 border border-slate-600">
      {files.map((file: GitStatusEntry) => {
        return (
          <div
            key={file.file_path}
          >
            {file.file_path}
          </div>
        );
      })}
    </div>
  );
}

