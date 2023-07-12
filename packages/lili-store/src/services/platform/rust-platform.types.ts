export type TauriInvokeArgs = Record<string, unknown>
  | string | number | boolean | null | undefined;

export type TauriInvokeFn = <Result>(
  command: string,
  args?: TauriInvokeArgs,
  args2?: TauriInvokeArgs,
) => Promise<Result>;

export interface TauriShellModule {
  shell: TauriShell;
}

export interface TauriShell {
  Command: TauriShellCommand;
}

// export type TauriShellCommand = (
//   command: string,
//   args: string[],
//   options: TauriShellCommandOptions,
// ) => TauriShellCommandInstance;
export interface TauriShellCommand {
  // construct
  new (
    command: string,
    args: string[],
    options: TauriShellCommandOptions,
  ): TauriShellCommandInstance;
}

export type TauriShellCommandInstance = {
  stdout: {
    on: TauriShellEventHandler;
  },
  stderr: {
    on: TauriShellEventHandler;
  },
  on: TauriShellEventHandler;
  spawn: () => TauriShellChild;
}

export type TauriShellCommandOptions = {
  cwd: string;
  encoding: 'utf-8';
}

export type TauriShellEventHandler = (event_name: string, event_handler: (result: string | Error | number) => void) => void;

export type TauriShellChild = {
  write: (content: string) => void;
};

