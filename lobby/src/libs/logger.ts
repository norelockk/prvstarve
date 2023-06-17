import { inspect } from 'util';
import { createWriteStream, WriteStream, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { LogLevel } from '../types';

export default class Logger {
  private consoleStream: WriteStream;
  private fileStream: WriteStream;

  constructor(private readonly moduleName: string) {
    const logsDir = resolve(__dirname, '../../logs');
    
    if (!existsSync(logsDir)) mkdirSync(logsDir);

    const logPath = resolve(logsDir, `${this.moduleName}.log`);

    this.consoleStream = process.stdout as any;
    this.fileStream = createWriteStream(logPath, { flags: 'a' });
  }

  log(level: LogLevel, message: string, data?: any) {
    const stackTrace = new Error().stack;
    if (stackTrace) {
      const stackFrames = stackTrace.split('\n').slice(2);
      const callerFrame = stackFrames[0];
      const [, filePath, lineNumber, columnNumber] = callerFrame.match(/at\s.+?\s\((.+):(\d+):(\d+)\)/) || [];

      if (filePath && lineNumber && columnNumber) {
        const formattedData = data ? inspect(data, { colors: true, depth: 3 }) : '';
        // const logMessage = `[${level.toUpperCase()}] ${new Date().toLocaleString()} :: ${filePath}:${lineNumber}:${columnNumber}: ${message} ${formattedData}`;
        const logMessage = `[${level.toUpperCase()}] ${new Date().toLocaleString()} :: ${message} ${formattedData}`;
        this.consoleStream.write(`${logMessage}\n`);
        this.fileStream.write(`${logMessage}\n`);
      } else {
        this.consoleStream.write(`${message}\n`);
        this.fileStream.write(`${message}\n`);
      }
    } else {
      this.consoleStream.write(`${message}\n`);
      this.fileStream.write(`${message}\n`);
    }
  }
}