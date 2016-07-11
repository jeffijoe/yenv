/**
 * To import in TypeScript:
 *
 * import yenv from 'yenv'
 */

declare namespace yenv {
  /**
   * The environment.
   */
  export type IEnvironment = any;

  /**
   * The yenv options
   *
   * @interface IYenvOpts
   */
  export interface IYenvOpts {
    /**
     * What environment should be used? Defaults to "development"
     *
     * @type {string}
     */
    env?: string;
    /**
     * The environment to check on. Defaults to `process.env`
     *
     * @type {IEnvironment}
     */
    envObject?: IEnvironment;
  }
}


/**
 * Loads the environment settings
 *
 * @param {string} [filePath]
 * @param {yenv.IYenvOpts} [opts]
 * @returns {yenv.IEnvironment}
 */
declare function yenv(filePath?: string, opts?: yenv.IYenvOpts): yenv.IEnvironment;

declare namespace yenv {}
export = yenv