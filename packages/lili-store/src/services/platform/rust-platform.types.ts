export type TauriInvokeArgs = Record<string, unknown>
  | string | number | boolean | null | undefined;

export type TauriInvokeFn = <Result>(
  command: string,
  args?: TauriInvokeArgs,
  args2?: TauriInvokeArgs,
) => Promise<Result>;
