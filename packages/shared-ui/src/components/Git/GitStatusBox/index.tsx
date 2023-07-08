import { PlatformClient, ReduxLoadingStatus, RepositoryInfo, selectOpenedRootProject, useAppSelector } from "@lili-project/lili-store";
import { GitFilesPicker } from "../GitFilesPicker";
import { useEffect, useState } from "react";
import { DiffPreview } from "../DiffPreview";

interface State {
  repo?: RepositoryInfo;
  loading_status: ReduxLoadingStatus;
  error: string;
}

export function GitStatusBox() {
  const project_dir = useAppSelector(selectOpenedRootProject())?.data?.project_dir;
  const [currentPath, setCurrentPath] = useState<string>('');
  const [fileContents, setFileContents] = useState<Record<string, string>>({});

  const [state, setState] = useState<State>({
    repo: undefined,
    loading_status: ReduxLoadingStatus.Idle,
    error: '',
  });

  const fetchFileContents = (path: string) => {
    try {
      PlatformClient.client().readTextFile(`${project_dir}/${path}`).then((content) => {
        setFileContents((fileContents) => ({
          ...fileContents,
          [path]: content,
        }));
      }).catch((error) => {
        console.error(`[GitStatusBox] fetchFileContents failed:`, error);
      });
    } catch (e) { }
  }

  const fetchRepositoryInfo = () => {
    if (!project_dir) {
      console.log('[GitStatusBox] project_dir is empty');
      return;
    }

    setState(state => ({
      ...state,
      loading_status: ReduxLoadingStatus.Loading,
      error: '',
    }));

    PlatformClient.client().repositoryInfo(project_dir).then((repo) => {
      setState(state => ({
        ...state,
        repo: repo,
        loading_status: ReduxLoadingStatus.Success,
        error: '',
      }));

      repo.git_status.forEach((file) => {
        fetchFileContents(file.file_path);
      });
    }).catch((error) => {
      console.error(`[GitStatusBox] fetchRepositoryInfo failed:`, error);
      setState(state => ({
        ...state,
        repo: undefined,
        loading_status: ReduxLoadingStatus.Error,
        error: error.message,
      }));
    });
  };

  useEffect(() => fetchRepositoryInfo(), []);

  if (state.loading_status === ReduxLoadingStatus.Success && state.repo) {
    return (
      <div className="flex flex-col relative z-100">
        <GitFilesPicker files={state.repo.git_status} onChange={setCurrentPath} />
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

