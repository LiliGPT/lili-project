import { SpecificPlatformClient } from "./platform.types";

export class PlatformClient {
  static client?: SpecificPlatformClient;

  static async setClient(client: SpecificPlatformClient): Promise<void> {
    console.log('PlatformClient.setClient', client);
    PlatformClient.client = client;
  }
}