export class AppError extends Error {
    constructor(action: string, message: string) {
        super(`${action} failed: ${message}`)
    }
}
