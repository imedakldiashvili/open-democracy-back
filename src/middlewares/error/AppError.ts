export class AppError {
    status: number
    message: string

    constructor(status: number, message: any) {
        this.status = status;
        this.message = message
    }

    static internal(msg: any) {
        return new AppError(500 , msg)
    }

    static badRequest(msg: any) {
        return new AppError(400 , msg)
    }

    static unauthorized(msg: any) {
        return new AppError(401, msg)
    }

    static forbidden(msg: any) {
        return new AppError(403, msg)
    }

    static notFound(msg: any) {
        return new AppError(404, msg)
    }


  }