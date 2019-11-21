export class UserNotFoundError extends Error {
    constructor(public message: string) {
        super(message);
    }
}
