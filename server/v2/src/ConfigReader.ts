import fs from 'fs';

export default class ConfigReader {
  /**
   * @private parsed
   * @type {Object}
   * @memberof ConfigReader
   * @description Parsed config object
   */
  private parsed: any = {};

  /**
   * @constructor
   * @param filePath
   * @returns {ConfigReader} 
   */
  constructor(filePath: string) {
    // Let's make sure the file exists and is readable
    try {
      fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
    } catch (e) {
      throw new Error('Config does not exist or is not readable');
    }

    // Try to open the file, and parse it
    try {
      this.parsed = JSON.parse(
        fs.readFileSync(filePath, {
          encoding: 'utf-8'
        })
      );
    } catch (e: any) {
      throw new Error(`Config could not be parsed: ${e.message}`);
    }
  }

  /**
   * @public get
   * @param key
   * @description Get a value from the config file
   * @returns {*}
   */
  get(key: string): any | undefined {
    if (key in this.parsed)
      return this.parsed[key];

    return undefined;
  }
}