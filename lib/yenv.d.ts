/**
 * To import in TypeScript:
 *
 * import * as yenv from 'yenv'
 */

declare namespace yenv {
  /**
   * The yenv options
   *
   * @interface IYenvOpts
   */
  export interface IYenvOpts<T> {
    /**
     * What environment should be used? Defaults to "development"
     *
     * @type {string}
     */
    env?: string
    /**
     * The environment to check on. Defaults to `process.env`
     *
     * @type {object}
     */
    envObject?: object
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
    optionalKeys?: Array<keyof T>
    /**
     * If `strict` is enabled, when an unknown key is found, calls this before throwing.
     * First parameter is the message, second is the missing key.
     * If `true`, uses `console.log`.
     */
    logBeforeThrow?: boolean | UnknownKeyLogger<keyof T>
  }

  /**
   * Callback for logging when using unknown keys
   */
  export type UnknownKeyLogger<K> = (message: string, key: K) => any
}

/**
 * Loads the environment settings
 *
 * @param {string} [filePath]
 * @param {yenv.IYenvOpts} [opts]
 * @returns {yenv.IEnvironment}
 */
declare function yenv<T = any>(filePath?: string, opts?: yenv.IYenvOpts<T>): T

declare namespace yenv {}

export = yenv
