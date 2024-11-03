import { FileSystemService } from "./fileSystem/FileSystemService"
import { LoggerService } from "./logger/LoggerService"

export class Service {
  loggerService: LoggerService
  fileSystemService: FileSystemService

  constructor() {
    
    this.loggerService = new LoggerService()
    this.fileSystemService = new FileSystemService()
  }
}
