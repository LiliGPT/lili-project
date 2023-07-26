import { PlatformClient } from '../platform/platform.client';
import { MissionAction, MissionExecution, TgComponent } from './prompter.types';

export class PrompterClient {
  // static url() {
  //   return 'http://localhost:3000';
  // }

  // --- Missions and Executions

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

  // --- Tailwind Generator

  static async askTailwindGenerator(sourceCode: string, message: string): Promise<string> {
    const request = { source_code: sourceCode, message };
    const response = await PlatformClient.client().invokeFn<string>('ask_tailwind_generator', { request });
    return response;
  }

  static async tgCreateComponent(name: string, training_description: string, categories: string[], source_code: string): Promise<TgComponent> {
    const request = { name, training_description, categories, source_code };
    const response = await PlatformClient.client().invokeFn<TgComponent>('tg_create_component', { request });
    return response;
  }
}
