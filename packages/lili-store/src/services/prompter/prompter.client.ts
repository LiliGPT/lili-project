import { PlatformClient } from '../platform/platform.client';
import { MissionAction, MissionExecution } from './prompter.types';

export class PrompterClient {
  static url = 'http://localhost:3000';

  static async createMission(projectDir: string, message: string): Promise<MissionExecution> {
    const request = { projectDir, message };
    const response = await PlatformClient.client().invokeFn<MissionExecution>('create_mission_command', request);
    return response;
  }

  static async setExecutionFail(executionId: string): Promise<void> {
    const request = { execution_id: executionId };
    await PlatformClient.client().invokeFn<void>('set_fail_command', { request });
  }

  static async setExecutionPerfect(executionId: string): Promise<void> {
    const request = { execution_id: executionId };
    await PlatformClient.client().invokeFn<void>('set_perfect_command', { request });
  }

  static async approveAndRun(projectDir: string, executionId: string): Promise<void> {
    const request = { path: projectDir, promptId: executionId };
    await PlatformClient.client().invokeFn<void>('rust_prompt_approve_and_run', request);
  }

  static async submitReview(projectDir: string, executionId: string): Promise<void> {
    const request = { cwd: projectDir, promptId: executionId };
    await PlatformClient.client().invokeFn<void>('rust_prompt_submit_review', request);
  }

  static async searchExecutions(filter: any): Promise<MissionExecution[]> {
    const request = { filter };
    const response = await PlatformClient.client().invokeFn<MissionExecution[]>('search_executions_command', { request });
    return response;
  }

  static async replaceExecutionActions(executionId: string, reviewedActions: MissionAction[]): Promise<void> {
    const request = { execution_id: executionId, reviewed_actions: reviewedActions };
    await PlatformClient.client().invokeFn<void>('review_actions_command', { request });
  }

  static async addContextFiles(projectDir: string, executionId: string): Promise<void> {
    const request = { project_dir: projectDir, execution_id: executionId };
    await PlatformClient.client().invokeFn<void>('add_context_files_command', { request });
  }

  static async retryExecution(executionId: string, message: string): Promise<void> {
    const request = { execution_id: executionId, message };
    await PlatformClient.client().invokeFn<void>('retry_execution_command', { request });
  }
}
