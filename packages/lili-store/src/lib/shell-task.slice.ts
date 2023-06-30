import { PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from "@reduxjs/toolkit";
import { ReduxShellLog, ReduxShellLogType, ReduxShellTask, ReduxShellTaskState } from "./shell-task.types";
import { RootState } from "../store";
import { PlatformClient } from "../services/platform/platform.client";
import { selectProject } from "./project.slice";

export const SHELLTASK_FEATURE_KEY = 'shelltask';

// --- Utils

const _shellTaskId = (project_id: string, command: string) =>
  `${project_id}-${command}`;

const _shellInstances: Record<string, KillFunction[]> = {};

const _delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

type KillFunction = () => Promise<void>;

const _shellKill = async (pid: number): Promise<string> => {
  const res = await PlatformClient.client().runShellCommand('/', `
    function kill_recursive() {
      local parent_pid=$1
      local child_pids=$(pgrep -P "$parent_pid")
      for pid in $child_pids; do
          kill_recursive "$pid"
      done
      kill -9 "$parent_pid"
    }
    kill_recursive ${pid}
  `);
  return res;
}

interface ShellSpawnProps {
  shell_task_id: string;
  command: string;
  cwd: string;
  on_stdout: (data: string) => void;
  on_stderr: (data: string) => void;
  on_error: (data: Error) => void;
  on_exit: (code: number) => void;
}

const _shellSpawn = async ({
  shell_task_id,
  command,
  cwd,
  on_stdout,
  on_stderr,
  on_error,
  on_exit,
}: ShellSpawnProps): Promise<number> => {
  if (!_shellInstances[shell_task_id]) {
    _shellInstances[shell_task_id] = [];
  }

  const pid = await PlatformClient.client().spawnShellCommand({
    command,
    cwd,
    on_stdout,
    on_stderr,
    on_error,
    on_exit,
  });

  return pid;
};

// --- Adapter

export const shellTaskAdapter = createEntityAdapter<ReduxShellTask>({
  selectId: (shellTask) => _shellTaskId(
    shellTask.project_id,
    shellTask.command,
  ),
});

// --- Initial State

export const initialShellTaskState: ReduxShellTaskState = shellTaskAdapter.getInitialState();

// --- Slice

export const shellTaskSlice = createSlice({
  name: SHELLTASK_FEATURE_KEY,
  initialState: initialShellTaskState,
  reducers: {
    addOne: shellTaskAdapter.addOne,
    upsertOne: shellTaskAdapter.upsertOne,
    removeOne: shellTaskAdapter.removeOne,
    addShellLog(
      state: ReduxShellTaskState,
      action: PayloadAction<ShellTaskArgs & { log: ReduxShellLog }>
    ) {
      const { project_id, command, log } = action.payload;
      const shell_task_id = _shellTaskId(project_id, command);
      const shell_task = state.entities[shell_task_id];
      if (!shell_task) {
        console.log(
          '[shellTaskSlice.addShellLog] error shell_task not found',
          action
        );
        return;
      }
      shell_task.logs.push(log);
    },
    setShellTaskPid(
      state: ReduxShellTaskState,
      action: PayloadAction<ShellTaskArgs & { pid: number}>,
    ) {
      const { project_id, command, pid } = action.payload;
      const shell_task_id = _shellTaskId(project_id, command);
      const shell_task = state.entities[shell_task_id];
      if (!shell_task) return;
      shell_task.pid = pid;
    },
    stopShellTask(
      state: ReduxShellTaskState,
      action: PayloadAction<ShellTaskArgs>,
    ) {
      const { project_id, command } = action.payload;
      const shell_task_id = _shellTaskId(project_id, command);
      const shell_task = state.entities[shell_task_id];
      if (!shell_task) {
        console.log(
          '[shellTaskSlice.addShellLog] error shell_task not found',
          action
        );
        return;
      }
      shell_task.is_running = false;
    },
  }
});

export const shellTaskReducer = shellTaskSlice.reducer;

// export const shellTaskActions = shellTaskSlice.actions;

// --- Selectors

const { selectAll, selectEntities } = shellTaskAdapter.getSelectors();

const getShellTaskState = (rootState: {
  [SHELLTASK_FEATURE_KEY]: ReduxShellTaskState;
}): ReduxShellTaskState => rootState[SHELLTASK_FEATURE_KEY];

export const selectShellTasks = () => createSelector(getShellTaskState, selectAll);

interface SelectShellTaskArgs {
  project_id: string;
  command: string;
}

export const selectShellTask =
  ({ project_id, command }: SelectShellTaskArgs) => 
    createSelector(
      getShellTaskState,
      (state) => {
        const shell_task_id = _shellTaskId(project_id, command);
        return selectEntities(state)[shell_task_id] as ReduxShellTask | undefined;
      }
    );

// --- Thunks

// addShellTaskThunk

interface ShellTaskArgs {
  project_id: string;
  command: string;
}

export const addShellTaskThunk = createAsyncThunk<
  void,
  ShellTaskArgs
>(`${SHELLTASK_FEATURE_KEY}/addShellTaskThunk`,
  async (args, { dispatch, getState }) => {
    const { project_id, command } = args;
    const state = getState() as RootState;
    const shell_task_id = _shellTaskId(project_id, command);
    const foundShellTask = selectShellTask({ project_id, command })(state);
    if (foundShellTask) {
      await dispatch(removeShellTaskThunk({
        project_id,
        command,
      }));
    }

    const shellTask: ReduxShellTask = {
      project_id,
      command,
      pid: undefined,
      is_running: true,
      logs: [],
    };

    dispatch(shellTaskSlice.actions.upsertOne(shellTask));
    
    const logHandler = (name: string) => async (data: any) => {
      const log: ReduxShellLog = {
        timestamp: Date.now(),
        type: name === 'stderr'
          ? ReduxShellLogType.Error
          : ReduxShellLogType.Normal,
        text: String(data),
      };
      dispatch(shellTaskSlice.actions.addShellLog({
        project_id,
        command,
        log,
      }));
    };
    const project = selectProject(project_id)(state);
    if (!project) {
      console.log(
        `[addShellTaskThunk] Project ${project_id} not found`
      );
      return;
    }
    const cwd = project.data.project_dir;
    console.log('--- pid request');
    _shellSpawn({
      shell_task_id,
      cwd,
      command,
      on_stdout: logHandler('stdout'),
      on_stderr: logHandler('stderr'),
      on_error: logHandler('error'),
      on_exit: logHandler('exit'),
    }).then((pid) => {
      console.log('--- pid = ', pid);
      dispatch(shellTaskSlice.actions.setShellTaskPid({
        project_id,
        command,
        pid,
      }));
    }).catch((err) => {
      console.log('[addShellTaskThunk] catch x99: ', err);
    });
  }
);

export const removeShellTaskThunk = createAsyncThunk<
  void,
  ShellTaskArgs
>(`${SHELLTASK_FEATURE_KEY}/removeShellTaskThunk`,
  async ({ project_id, command }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const shellTask = selectShellTask({
      project_id,
      command,
    })(state);
    if (!shellTask?.pid) {
      console.log(
        `[removeShellTaskThunk] error, shellTask without pid: `,
        shellTask,
      );
      // return;
    }
    if (shellTask?.pid) await _shellKill(shellTask.pid);
    dispatch(shellTaskSlice.actions.removeOne(
      _shellTaskId(project_id, command)
    ));
  }
);

export const stopShellTaskThunk = createAsyncThunk<
  void,
  ShellTaskArgs
>(`${SHELLTASK_FEATURE_KEY}/stopShellTaskThunk`,
  async ({ project_id, command }, { dispatch, getState }) => {
    const state = getState() as RootState;
    const shellTask = selectShellTask({
      project_id,
      command,
    })(state);
    if (!shellTask) {
      console.log(
        `[stopShellTaskThunk] error, shellTask not found`
      );
      return;
    }
    console.log('Stop shellTask ', shellTask);
    if (shellTask.pid) {
      await _shellKill(shellTask.pid);
    }
    dispatch(shellTaskSlice.actions.stopShellTask({
      project_id,
      command,
    }));
  }
);

