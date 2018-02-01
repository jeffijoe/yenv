/**
 * To import in TypeScript:
 *
 * import * as yenv from 'yenv'
 */

declare namespace yenv {
  /**
   * The environment.
   */
  export type IEnvironment = any

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
    env?: string
    /**
     * The environment to check on. Defaults to `process.env`
     *
     * @type {IEnvironment}
     */
    envObject?: IEnvironment
    /**
     * If `true`, skips type coercion.
     */
    raw?: boolean
    /**
     * If `true` (default), wraps the result in `keyblade` which protects
     * against undefined keys.
     */
    strict?: boolean
    /**
     * If `strict` is enabled, allows these keys to not exist.
     */
    optionalKeys?: Array<string>
    /**
     * If `strict` is enabled, when an unknown key is found, calls this before throwing.
     * First parameter is the message, second is the missing key.
     */
    logBeforeThrow?: UnknownKeyLogger
  }
}

/**
 * Unknown key logger callback.
 */
export type UnknownKeyLogger = (message: string, key: string) => any

/**
 * Loads the environment settings
 *
 * @param {string} [filePath]
 * @param {yenv.IYenvOpts} [opts]
 * @returns {yenv.IEnvironment}
 */
declare function yenv(
  filePath?: string,
  opts?: yenv.IYenvOpts
): yenv.IEnvironment

declare namespace yenv {

}
export = yenv
