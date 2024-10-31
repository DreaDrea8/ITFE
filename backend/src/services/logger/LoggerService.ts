import {LogId} from '@tools/range';
import DateFormatter from '@tools/DateFormatter';

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

export class LoggerService {

  private inConsole: boolean;

  constructor  (inConsole?: boolean) {
    this.inConsole = inConsole ?? true;
  }

  public async default(message: string): Promise<void> {
    await this.logMessage(LogTypeMessageEnum.DEFAULT, LogTypeColorEnum.DEFAULT, message);
  }

  public async info(message: string): Promise<void> {
    await this.logMessage(LogTypeMessageEnum.INFO, LogTypeColorEnum.BLUE, message);
  }

  public async obj(obj:any): Promise<void> {
    const id: number | void = LogId.next().value;
    const time: string = DateFormatter.toFrenchFormat(new Date()); 
    const content: string = this.contentFormatter(id ?? '', time, LogTypeMessageEnum.INFO, 'Object');

    // Log
    if (this.inConsole) {
      console.log(LogTypeColorEnum.BLUE, content, ...(Array.isArray(obj) ? obj : [obj]));
   }
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
  }

  private contentFormatter = (id: number|string, time:string, typeMessage:string, message:string, detail?:string): string => {
    return `${id} - ${time} : [${typeMessage}] ${message} ${detail? '\n\t MORE DETAILS:'+ detail: ''}`;
  };
}

const loggerService = new LoggerService()
export default loggerService