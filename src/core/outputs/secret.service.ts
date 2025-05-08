export abstract class SecretService {
    abstract get(name: string): Promise<string>;
}