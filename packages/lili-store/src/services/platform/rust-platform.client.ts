import { PlatformError } from './platform.error';
import { CodeProject, SpecificPlatformClient, PlatformSignInResponse, SpawnShellCommandArgs, RepositoryInfo, RunShellCommandResponse } from './platform.types';
import { TauriInvokeFn, TauriShell, TauriShellModule } from './rust-platform.types';

const _delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export class RustPlatformClient implements SpecificPlatformClient {
  invokeFn: TauriInvokeFn;
  shell: TauriShell;

  constructor(invokeFn: TauriInvokeFn, shell: TauriShellModule) {
    this.invokeFn = invokeFn;
    this.shell = shell.shell;
  }

  async pickProject(path?: string): Promise<CodeProject> {
    // throw new PlatformError('not_implemented', 'Rust platform not implemented.');
    const project = await this.invokeFn<CodeProject>('open_project', { path: path ?? '' });
    return project;
  }

  async signInPlatform(): Promise<PlatformSignInResponse> {
    const result = await this.invokeFn<PlatformSignInResponse>('auth_login_platform', {});
    console.log('signInPlatform result: ', result);
    return result;
  }

  async signInPassword(username: string, password: string): Promise<PlatformSignInResponse> {
    const request = { username, password };
    const result = await this.invokeFn<PlatformSignInResponse>('auth_login_command', { request });
    console.log('signInPassword result: ', result);
    return result;
  }

  async refreshToken(refresh_token: string): Promise<PlatformSignInResponse> {
    const request = { refresh_token };
    const result = await this.invokeFn<PlatformSignInResponse>('auth_refresh_token_command', { request });
    console.log('refreshToken result: ', result);
    return result;
  }

  async runShellCommand(cwd: string, command: string): Promise<string> {
    const request = { cwd, command };
    return await this.invokeFn<string>('run_shell_command', request);
  }

  async spawnShellCommand(args: SpawnShellCommandArgs): Promise<number> {
    const {
      cwd,
      command,
      on_exit,
      on_error,
      on_stderr,
      on_stdout,
    } = args;

    const cmd = new this.shell.Command('bash', [], {
      cwd,
      encoding: 'utf-8',
    });
    cmd.stdout.on('data', on_stdout);
    cmd.stderr.on('data', on_stderr);
    cmd.on('error', on_error);
    cmd.on('close', on_exit);
    const child = await cmd.spawn();
    child.write(`${command}\n`);
    await _delay(5000);
    let pid;
    try {
      const command_pid = `ps -ax | grep Sl+ | grep -v grep | awk '{print $1}' | tail -1`;
      pid = await this.runShellCommand(cwd, command_pid);
    } catch (err) {
      console.log(
        `[RustPlatformClient.spawnShellCommand] pid error: `,
        err,
      );
    }

    if (!pid) return 0;
    return parseInt(pid);
  }

  async installProjectDependencies(cwd: string): Promise<void> {
    const request = { cwd };
    await this.invokeFn<void>('install_dependencies', request);
  }

  async repositoryInfo(project_dir: string): Promise<RepositoryInfo> {
    const request = { project_dir };
    return await this.invokeFn<RepositoryInfo>('repository_info_command', { request });
  }

  async readTextFile(path: string): Promise<string> {
    return await this.invokeFn<string>('read_text_file_command', { path });
  }

  async gitAdd(project_dir: string, path: string): Promise<void> {
    const request = { project_dir, path };
    await this.invokeFn<void>('git_add_command', { request });
  }

  async gitCommit(project_dir: string, message: string): Promise<void> {
    const request = { project_dir, message };
    await this.invokeFn<void>('git_commit_command', { request });
  }

  async gitReset(project_dir: string, path: string): Promise<void> {
    const request = { project_dir, path };
    await this.invokeFn<void>('git_reset_command', { request });
  }

  async gitCustom(project_dir: string, command: string, args: string): Promise<RunShellCommandResponse> {
    const request = { project_dir, command, args };
    return await this.invokeFn<RunShellCommandResponse>('git_custom_command', { request });
  }

  async openTerminal(): Promise<void> {
    await this.invokeFn<void>('open_terminal', {});
  }
}
