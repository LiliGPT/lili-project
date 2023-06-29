import { PlatformError } from './platform.error';
import { CodeProject, SpecificPlatformClient, PlatformSignInResponse } from './platform.types';
import { TauriInvokeFn } from './rust-platform.types';

export class RustPlatformClient implements SpecificPlatformClient {
  invokeFn: TauriInvokeFn;
  
  constructor(invokeFn: TauriInvokeFn) {
    this.invokeFn = invokeFn;
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

  async installProjectDependencies(cwd: string): Promise<void> {
    const request = { cwd };
    await this.invokeFn<void>('install_dependencies', request);
  }
}