import { BigIntStats, MakeDirectoryOptions, RmDirOptions, StatOptions, Stats } from 'fs';

import LsDirOptions from '@service/fileSystem/dto/LsdirOptions';

export default abstract class FileSystemService {
  abstract createDirectory (directoryRoot:string, directoryLocation:string, directoryName: string, options?:MakeDirectoryOptions): Promise<void>;
  abstract listDirectory (directoryRoot:string, directoryLocation:string, directoryName: string, options?:LsDirOptions): Promise<string[]|void>;
  abstract deleteDirectory (directoryRoot:string, directoryLocation:string, directoryName: string, options?:RmDirOptions): Promise<void>;
  abstract getFileInfo (directoryRoot:string, fileLocation:string, fileName: string, options?:StatOptions): Promise<Stats|BigIntStats|void>;
  abstract updateFileContent (directoryRoot:string, fileLocation:string, fileName: string, content:string): Promise<void>;
  abstract renameFile (directoryRoot:string, oldFileLocation:string, oldFileName: string, newFileLocation: string, newFileName: string): Promise<void>;
  abstract cpFile (directoryRoot:string, oldFileLocation:string, oldFileName: string, newFileLocation: string, newFileName: string): Promise<void>;
  abstract deleteFile (directoryRoot:string, directoryLocation:string, directoryName: string): Promise<void>;
}