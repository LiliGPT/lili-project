import { PlatformClient, ReduxLoadingStatus, RepositoryInfo, RepositoryInfoState, selectOpenedRootProject, useAppSelector } from "@lili-project/lili-store";
import { GitFilesPicker } from "../GitFilesPicker";
import { useEffect, useState } from "react";
import { DiffPreview } from "../DiffPreview";
import { CustomButton } from '../../Button';
import { TextInput } from '../../TextInput';

interface Props {
  state: RepositoryInfoState;
  currentPath: string;
  setCurrentPath: (path: string) => void;
  fileContents: Record<string, string>;
  setFileContents: (fileContents: Record<string, string>) => void;
  gitAdd: (path: string) => void;
  gitReset: (path: string) => void;
  gitCommit: (message: string) => void;
}

export function GitStatusBox({
  state,
  currentPath,
  setCurrentPath,
  fileContents,
  // setFileContents,
  gitAdd,
  gitReset,
  gitCommit,
}: Props) {
  const [commitMessage, setCommitMessage] = useState<string>('');

  if (!state) {
    return null;
  }

  const stagedFiles = state.repo?.git_status.filter((file) => file.is_staged) ?? [];
  const untrackedFiles = state.repo?.git_status.filter((file) => !file.is_staged) ?? [];

  const commitBlock = stagedFiles.length > 0 && (
    <div className="">
      <TextInput
        label='Commit message'
        value={commitMessage}
        onChange={(value) => setCommitMessage(value)}
        action={{
          label: 'Commit',
          onClick: () => {
            gitCommit(commitMessage);
          },
          loading: false,
        }}
      />
    </div>
  );

  if (state.loading_status === ReduxLoadingStatus.Success && state.repo) {
    return (
      <div className="flex flex-col relative z-100">
        <div className="pb-4">
          <CustomButton
            label='Add all'
            onClick={() => {
              gitAdd('.');
            }}
            size='medium'
            variant='boldy'
            disabled={untrackedFiles.length === 0}
          />

          <CustomButton
            label='Reset all'
            onClick={() => {
              gitReset('.');
            }}
            size='medium'
            variant='boldy'
            disabled={stagedFiles.length === 0}
          />
        </div>
        {commitBlock}
        {untrackedFiles.length > 0 && (
          <GitFilesPicker
            files={untrackedFiles}
            onChange={setCurrentPath}
          />
        )}
        {stagedFiles.length > 0 && (<GitFilesPicker
          files={stagedFiles}
          onChange={setCurrentPath}
        />)}
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

