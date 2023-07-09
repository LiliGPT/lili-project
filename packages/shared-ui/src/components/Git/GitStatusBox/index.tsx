import { PlatformClient, ReduxLoadingStatus, RepositoryInfo, RepositoryInfoState, selectOpenedRootProject, useAppSelector } from "@lili-project/lili-store";
import { GitFilesPicker } from "../GitFilesPicker";
import { useEffect, useState } from "react";
import { DiffPreview } from "../DiffPreview";

interface Props {
  state: RepositoryInfoState;
  currentPath: string;
  setCurrentPath: (path: string) => void;
  fileContents: Record<string, string>;
  setFileContents: (fileContents: Record<string, string>) => void;
}

export function GitStatusBox({
  state,
  currentPath,
  setCurrentPath,
  fileContents,
  // setFileContents,
}: Props) {
  if (!state) {
    return null;
  }

  if (state.loading_status === ReduxLoadingStatus.Success && state.repo) {
    return (
      <div className="flex flex-col relative z-100">
        <GitFilesPicker
          files={state.repo.git_status}
          onChange={setCurrentPath}
        />
        <GitFilesPicker files={[]} onChange={() => { }} />
        {!!currentPath && (
          <DiffPreview
            path={currentPath}
            diffText={state.repo.diff_text}
            content={fileContents[currentPath] ?? ''}
          />
        )}
      </div>
    );
  }
}

