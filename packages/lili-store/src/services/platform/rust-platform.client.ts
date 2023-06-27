import { PlatformError } from './platform.error';
import { CodeProject, SpecificPlatformClient } from './platform.types';
import { TauriInvokeFn } from './rust-platform.types';

export class RustPlatformClient implements SpecificPlatformClient {
  invokeFn: TauriInvokeFn;
  
  constructor(invokeFn: TauriInvokeFn) {
    this.invokeFn = invokeFn;
  }

  async pickProject(): Promise<CodeProject> {
    // throw new PlatformError('not_implemented', 'Rust platform not implemented.');
    const project = await this.invokeFn<CodeProject>('open_project', { path: '' });
    return project;
  }
}