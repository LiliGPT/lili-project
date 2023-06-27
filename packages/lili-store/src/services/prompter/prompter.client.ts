import { PlatformClient } from '../platform/platform.client';
import { MissionExecution } from './prompter.types';

export class PrompterClient {
  static url = 'http://localhost:3000';

  static async createMission(projectDir: string, message: string): Promise<MissionExecution> {
    const request = { projectDir, message };
    const response = await PlatformClient.client().invokeFn<MissionExecution>('create_mission_command', request);
    return response;
  }
}