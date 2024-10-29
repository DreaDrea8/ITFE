import {LogId} from '@tools/range';
import { Inversify } from '@inversify/Inversify';
import DateFormatter from '@tools/DateFormatter';
import LoggerService from '@service/logger/Logger.service';

enum LogTypeMessageEnum {
  DEFAULT = '',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

enum LogTypeColorEnum {
  BLUE = '\x1b[34m',
  GREEN = '\x1b[32m',
  YELLOW = '\x1b[33m',
  RED = '\x1b[31m',
  DEFAULT = '\x1b[0m'
}


export default class LoggerServiceReal extends LoggerService {
  private inversify: Inversify;

  private inConsole: boolean;
  private inFile: boolean;
  private inDatabase: boolean;

  private readonly logFolder:string = 'logs';
  private readonly logPath:string = process.env.API_LOGS_PATH ?? 'c:/users';
  private readonly logFile:string = 'index.log';
  private customLogPath:string|undefined;
  private customLogFolder:string|undefined;
  private customLogfile:string|undefined;

  constructor  (inversify:Inversify, inConsole?: boolean, inFile?: boolean, inDatabase?: boolean) {
    super();
    this.inversify = inversify;
    this.inConsole = inConsole ?? true;
    this.inFile = inFile ?? true;
    this.inDatabase = inDatabase ?? false;
  }

  public async default(message: string): Promise<void> {
    await this.logMessage(LogTypeMessageEnum.DEFAULT, LogTypeColorEnum.DEFAULT, message);
  }

  public async info(message: string): Promise<void> {
    await this.logMessage(LogTypeMessageEnum.INFO, LogTypeColorEnum.BLUE, message);
  }

  public async success(message: string): Promise<void> {
    await this.logMessage(LogTypeMessageEnum.SUCCESS, LogTypeColorEnum.GREEN, message);
  }

  public async warn(message: string): Promise<void> {
    await this.logMessage(LogTypeMessageEnum.WARN, LogTypeColorEnum.YELLOW, message);
  }

  public async error(message: string, error?: Error): Promise<void> {
    await this.logMessage(LogTypeMessageEnum.ERROR, LogTypeColorEnum.RED, message, JSON.stringify(error));
  }

  private async logMessage(typeMessage: string, colorMessage: string, message: string, detail?: string): Promise<void> {
    const id: number | void = LogId.next().value;
    const time: string = DateFormatter.toFrenchFormat(new Date()); 
    const content: string = this.contentFormatter(id ?? '', time, typeMessage, message, detail);

    // Log
    if (this.inConsole) {
      console.log(colorMessage, content);
    }
    if (this.inFile) {
      const logPath: string = this.customLogPath ?? this.logPath;
      const logFolder: string = this.customLogFolder ?? this.logFolder;
      const logFile: string = this.customLogfile ?? this.logFile;

      await this.inversify.fileSystemService.updateFileContent(logPath, logFolder, logFile, content);
    }
    if (this.inDatabase) {
      console.log('this.inDatabase : true');
    }
  }


	public custom (customLogPath:string|undefined , customLogFolder:string|undefined , customLogfile:string|undefined ): this {
    this.customLogPath = customLogPath;
    this.customLogFolder = customLogFolder;
    this.customLogfile = customLogfile;
    
    return this;
	}


  private contentFormatter = (id: number|string, time:string, typeMessage:string, message:string, detail?:string): string => {
    return `${id} - ${time} : [${typeMessage}] ${message} ${detail? '\n\t MORE DETAILS:'+ detail: ''}`;
  };
}
