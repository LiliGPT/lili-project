import { PlatformError } from './platform.error';
import { CodeProject, SpecificPlatformClient, PlatformSignInResponse, SpawnShellCommandArgs } from './platform.types';
import { TauriInvokeFn, TauriShellModule } from './rust-platform.types';

const _delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export class RustPlatformClient implements SpecificPlatformClient {
  invokeFn: TauriInvokeFn;
  shell: TauriShellModule;
  
  constructor(invokeFn: TauriInvokeFn, shell: TauriShellModule) {
    this.invokeFn = invokeFn;
    this.shell = shell;
  }

  async pickProject(path?: string): Promise<CodeProject> {
    // throw new PlatformError('not_implemented', 'Rust platform not implemented.');
    const project = await this.invokeFn<CodeProject>('open_project', { path: path ?? '' });
    return project;
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
}
