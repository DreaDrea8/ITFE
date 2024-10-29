import path from 'path';
import { appendFile, copyFile, mkdir, readdir, rename, rm, stat, unlink} from 'fs/promises';
import { BigIntStats, MakeDirectoryOptions, PathLike, RmDirOptions, StatOptions, Stats } from 'fs';

import { Inversify } from '@inversify/Inversify';
import LsDirOptions from '@service/fileSystem/dto/LsdirOptions';
import { instanceOfErrnoException } from '@tools/instanceOfNodeError';
import FileSystemService from '@service/fileSystem/FileSystem.serivce';


export default class FileSystemServiceReal extends FileSystemService {
  guard = true;
  inversify: Inversify;

  constructor(inversify: Inversify) {
    super();
    this.inversify = inversify;
  }

  /**
   * Creates a directory at the specified location.
   * @async
   * @param {string} [directoryRoot] - The root directory from which to start.
   * @param {string} directoryLocation - The location where the directory should be created.
   * @param {string} [directoryName] - The name of the directory to create. Defaults to empty string
   * @param {MakeDirectoryOptions} [options] - Optional options for creating the directory
   * @returns {Promise<void>} A promise that resolves when the directory is created.
   */
  public createDirectory = async (directoryRoot:string, directoryLocation:string, directoryName:string, options?:MakeDirectoryOptions): Promise<void>  => {
    const directoryPath: PathLike = path.join(directoryRoot, directoryLocation , directoryName);
    try {
      await mkdir(directoryPath, options); 
    } catch (error: unknown) {
      if (instanceOfErrnoException(error)){
        if (error.code === 'EEXIST'){
          this.inversify.loggerService.error(`Create directory - Already exists ${directoryPath}, ${error.name}: ${error.message}`, error);
        } else if (error.code === 'ENOENT'){
          this.inversify.loggerService.error(`Create directory - No such directory ${directoryPath}, ${error.name}: ${error.message}`, error);
        } else {
          this.inversify.loggerService.error(`Create directory ${directoryPath}, ${error.name}: ${error.message}`, error);
        }
      } else if(error instanceof Error) {
        this.inversify.loggerService.error(`Create directory ${directoryPath}, ${error.name}: ${error.message}`, error);
      } else {
        this.inversify.loggerService.error(`Create directory ${directoryPath}, ${JSON.stringify(error)}`);
      }
    }
  };

  /**
   * Lists the contents of a directory.
   * @async
   * @param {string} [directoryRoot] - The root directory from which to start.
   * @param {string} directoryLocation - The location of the directory.
   * @param {string} [directoryName=''] - The name of the directory. Defaults to empty string
   * @param {LsDirOptions} [options] - Optional directory listing options.
   * @returns {Promise<string[] | void>} A promise that resolves to an array of file names in the directory or void if an error occurs.
   */
  public listDirectory = async (directoryRoot:string, directoryLocation:string, directoryName='', options?:LsDirOptions): Promise<string[]|void>  => {
    const directoryPath: PathLike = path.join(directoryRoot, directoryLocation , directoryName);
    try {
      const files:string[]|void = await readdir(directoryPath, options);
      return files;
    } catch (error: unknown) {
      if (instanceOfErrnoException(error)){
        if(error.code === 'ENOENT') {
          this.inversify.loggerService.error(`List directory - No such directory ${directoryPath}, ${error.name}: ${error.message}`, error);
        } else {
          this.inversify.loggerService.error(`List directory ${directoryPath}, ${error.name}: ${error.message}`, error);
        }
      } else if(error instanceof Error) {
        this.inversify.loggerService.error(`List directory ${directoryPath}, ${error.name}: ${error.message}`, error);
      } else {
        this.inversify.loggerService.error(`List directory  ${directoryPath}, ${JSON.stringify(error)}`);
      }
    }
  };

  /**
   * Deletes a directory at the specified location.
   * @async
   * @param {string} [directoryRoot] - The root directory from which to start.
   * @param {string} directoryLocation - The location of the directory to delete.
   * @param {string} directoryName - The name of the directory to delete.
   * @param {RmDirOptions} [options] - Optional options for removing the directory.
   * @returns {Promise<void>} A promise that resolves when the directory is deleted.
   */
  public deleteDirectory = async (directoryRoot:string, directoryLocation:string, directoryName: string, options?: RmDirOptions): Promise<void> => {
    const directoryPath: PathLike = path.join(directoryRoot, directoryLocation , directoryName);
    try {
      await rm(directoryPath, options);
    } catch (error: unknown) {
      if (instanceOfErrnoException(error)){
        if ( error.code === 'ENOENT'){
          this.inversify.loggerService.error(`Delete directory - No such directory, ${directoryPath}, ${error.name}: ${error.message}`, error);
        } else {
          this.inversify.loggerService.error(`Delete directory, ${directoryPath}, ${error.name}: ${error.message}`, error);
        }
      } else if(error instanceof Error) {
        this.inversify.loggerService.error(`Delete directory, ${directoryPath}, ${error.name}: ${error.message}`, error);
      } else {
        this.inversify.loggerService.error(`Delete directory, ${directoryPath}, ${JSON.stringify(error)}`);
      }
    }
  };

  /**
   * Gets information about a file.
   * @param {string} [directoryRoot] - The root directory path.
   * @param {string} fileLocation - The location of the file relative to the root directory.
   * @param {string} fileName - The name of the file to get information about.
   * @param {StatOptions} [options] - Options for retrieving file stats.
   * @returns {Promise<Stats|BigIntStats|void>} - The file stats.
   */
  public getFileInfo = async (directoryRoot:string, fileLocation:string, fileName: string, options?:StatOptions): Promise<Stats|BigIntStats|void>  => {
    const filePath: PathLike = path.join(directoryRoot, fileLocation , fileName);
    try {
      const stats = await stat(filePath, options); 
      return stats; 
    } catch (error: unknown) {
      if (instanceOfErrnoException(error)){
        if (error.code === 'ENOENT'){
          this.inversify.loggerService.error(`Get file info - No such file ${filePath}, ${error.name}: ${error.message}`, error);
        } else {
          this.inversify.loggerService.error(`Get file info ${filePath}, ${error.name}: ${error.message}`, error);
        }
      } else if(error instanceof Error) {
        this.inversify.loggerService.error(`Get file info ${filePath}, ${error.name}: ${error.message}`, error);
      } else {
        this.inversify.loggerService.error(`Get file info ${filePath}, ${JSON.stringify(error)}`);
      }
    }
  };

  /**
   * Appends content to a file, creating the file if it doesn't exist.
   * @param {string} [directoryRoot] - The root directory path.
   * @param {string} fileLocation - The location of the file relative to the root directory.
   * @param {string} fileName - The name of the file to update.
   * @param {string} content - The content to append to the file.
   * @returns {Promise<void>}
   */
  public updateFileContent = async (directoryRoot:string, fileLocation:string, fileName: string, content:string): Promise<void>  => {
    const filePath: PathLike = path.join(directoryRoot, fileLocation , fileName);
    try {
      await appendFile(filePath, content+ '\n', { encoding:'utf8', flag: 'a+'}); 
      this.guard = true;
    } catch (error: unknown) {
      if (instanceOfErrnoException(error)){
        if (error.code === 'ENOENT'){
          if (this.guard){
            this.guard = false;
            await this.createDirectory(directoryRoot, fileLocation, '', {recursive :true} );
            await this.updateFileContent(directoryRoot, fileLocation, fileName, content);
          }
        } else {
          this.inversify.loggerService.error(`Update file content ${filePath}, ${error.name}: ${error.message}`, error);
        }
      } else if(error instanceof Error) {
        this.inversify.loggerService.error(`Update file content ${filePath}, ${error.name}: ${error.message}`, error);
      } else {
        this.inversify.loggerService.error(`Update file content ${filePath}, ${JSON.stringify(error)}`);
      }
    }
  };


  /**
   * Renames a file, creating necessary directories if they do not exist.
   * @param {string} [directoryRoot] - The root directory path.
   * @param {string} oldFileLocation - The old location of the file relative to the root directory.
   * @param {string} oldFileName - The old name of the file.
   * @param {string} newFileLocation - The new location of the file relative to the root directory.
   * @param {string} newFileName - The new name of the file.
   * @returns {Promise<void>}
   */
  public renameFile = async (directoryRoot:string, oldFileLocation:string, oldFileName: string, newFileLocation: string, newFileName: string): Promise<void>  => {
    const oldFilePath: PathLike = path.join(directoryRoot, oldFileLocation , oldFileName);
    const newFilePath: PathLike = path.join(directoryRoot, newFileLocation , newFileName);
    try {
      await rename(oldFilePath, newFilePath); 
      this.guard = true;
    } catch (error: unknown) {
      if (instanceOfErrnoException(error)){
        if (error.code === 'EEXIST'){
          this.inversify.loggerService.error(`Rename file - Already exists ${newFilePath}, ${error.name}: ${error.message}`, error);
        } else if (error.code === 'ENOENT'){
          const files:string[] = await this.listDirectory(directoryRoot, oldFileLocation) ?? [];
          for(const fileName of files){
            if (fileName === oldFileName && this.guard){
              this.guard = false;
              await this.createDirectory(directoryRoot, newFileLocation, '', {recursive: true});
              await this.renameFile(directoryRoot, oldFileLocation, oldFileName, newFileLocation, newFileName);
            }
          }
        } else {
          this.inversify.loggerService.error(`Rename file ${newFilePath}, ${error.name}: ${error.message}`, error);
        }
      } else if(error instanceof Error) {
        this.inversify.loggerService.error(`Rename file ${newFilePath}, ${error.name}: ${error.message}`, error);
      } else {
        this.inversify.loggerService.error(`Rename file ${newFilePath}, ${JSON.stringify(error)}`);
      }
    }
  };

  /**
   * Copies a file, creating necessary directories if they do not exist.
   * @param {string} [directoryRoot] - The root directory path.
   * @param {string} oldFileLocation - The old location of the file relative to the root directory.
   * @param {string} oldFileName - The old name of the file.
   * @param {string} newFileLocation - The new location of the file relative to the root directory.
   * @param {string} newFileName - The new name of the file.
   * @returns {Promise<void>}
   */
  public cpFile = async (directoryRoot:string, oldFileLocation:string, oldFileName: string, newFileLocation: string, newFileName: string): Promise<void>  => {
    const oldFilePath: PathLike = path.join(directoryRoot, oldFileLocation , oldFileName);
    const newFilePath: PathLike = path.join(directoryRoot, newFileLocation , newFileName);
    try {
      await copyFile(oldFilePath, newFilePath); 
    } catch (error: unknown) {
      if (instanceOfErrnoException(error)){
        if (error.code === 'EEXIST'){
          this.inversify.loggerService.error(`Copy file - Already exists ${newFilePath}, ${error.name}: ${error.message}`, error);
        } else if (error.code === 'ENOENT'){
          const files:string[] = await this.listDirectory(directoryRoot, oldFileLocation) ?? [];
          for(const fileName of files){
            if (fileName === oldFileName && this.guard){
              this.guard = false;
              await this.createDirectory(directoryRoot, newFileLocation, '', {recursive: true});
              await this.renameFile(directoryRoot, oldFileLocation, oldFileName, newFileLocation, newFileName);
            }
          }
        } else {
          this.inversify.loggerService.error(`Copy file ${newFilePath}, ${error.name}: ${error.message}`, error);
        }
      } else if(error instanceof Error) {
        this.inversify.loggerService.error(`Copy file ${newFilePath}, ${error.name}: ${error.message}`, error);
      } else {
        this.inversify.loggerService.error(`Copy file ${newFilePath}, ${JSON.stringify(error)}`);
      }
    }
  };

   /**
    * Deletes a file.
    * @param {string} [directoryRoot] - The root directory path.
    * @param {string} directoryLocation - The location of the file relative to the root directory.
    * @param {string} directoryName - The name of the file to delete.
    * @returns {Promise<void>}
    */
  public deleteFile = async (directoryRoot:string, directoryLocation:string, directoryName: string): Promise<void> => {
    const directoryPath: PathLike = path.join(directoryRoot, directoryLocation , directoryName);
    try {
      await unlink(directoryPath);
    } catch (error: unknown) {
      if (instanceOfErrnoException(error)){
        if (error.code === 'ENOENT'){
          this.inversify.loggerService.error(`Delete file - No such file, ${directoryPath}, ${error.name}: ${error.message}`, error);
        } else {
          this.inversify.loggerService.error(`Delete file, ${directoryPath}, ${error.name}: ${error.message}`, error);
        }
      } else if(error instanceof Error) {
        this.inversify.loggerService.error(`Delete file, ${directoryPath}, ${error.name}: ${error.message}`, error);
      } else {
        this.inversify.loggerService.error(`Delete file, ${directoryPath}, ${JSON.stringify(error)}`);
      }
    }
  };
}
