export type TauriInvokeArgs = Record<string, unknown>;

export type TauriInvokeFn = <Result>(command: string, args?: TauriInvokeArgs) => Promise<Result>;
