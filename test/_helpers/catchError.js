'use strict'

/**
 * Catches an error and returns it.
 *
 * @param  {Function} fn
 * The function to invoke.
 *
 * @return {Error}
 * The error that was caught.
 */
module.exports = function catchError(fn) {
  try {
    fn()
    return undefined
  } catch (e) {
    return e
  }
}
