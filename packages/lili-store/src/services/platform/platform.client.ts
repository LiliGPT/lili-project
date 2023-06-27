import { PlatformError } from './platform.error';
import { SpecificPlatformClient } from "./platform.types";

export class PlatformClient {
  private static _client?: SpecificPlatformClient;

  static client(): SpecificPlatformClient {
    if (!PlatformClient._client) {
      throw new PlatformError('PlatformClient.client()', 'Platform client not set.');
    }
    return PlatformClient._client;
  }

  static async setClient(client: SpecificPlatformClient): Promise<void> {
    // console.log('PlatformClient.setClient', client);
    PlatformClient._client = client;
  }
}