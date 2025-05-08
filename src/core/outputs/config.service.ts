export abstract class ConfigService {
  abstract get (name: string): Promise<string>
}
