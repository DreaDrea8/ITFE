export default abstract class LoggerService {
  
  constructor () {console.log('Hello',process.env.HOSTNAME);}
  abstract default (message:string): void;
  abstract info (message:string): void;
  abstract success (message:string): void;
  abstract warn (message:string): void;
  abstract error (message:string, error?: Error): void;
  abstract custom (customLogPath:string|undefined , customLogFolder:string|undefined , customLogfile:string|undefined ): this;
}