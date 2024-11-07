import { LoggerService } from "./logger/LoggerService"
import { FileSystemService } from "./fileSystem/FileSystemService"

export class Service {
  loggerService: LoggerService
  fileSystemService: FileSystemService

  constructor() {
    this.loggerService = new LoggerService()
    this.fileSystemService = new FileSystemService(this.loggerService)
  }

  formatError(error: any, genericErrorMessage: string): {message:string, cause: any} {
    const formattedCause = error.cause
      ? JSON.parse(JSON.stringify(error.cause, Object.getOwnPropertyNames(error.cause)))
      : null;
  
    return {
      message: error.message || genericErrorMessage,
      cause: formattedCause
        ? {
            message: formattedCause.message,
            stack: formattedCause.stack,
            innerCause: formattedCause.cause ? this.formatError(formattedCause.cause, genericErrorMessage) : null
          }
        : null,
    };
  }
}
