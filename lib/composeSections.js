'use strict'

// What key should we look at when composing?
const COMPOSE_SYMBOL = '~compose'

/**
 * Returns a new error indicating circular sections.
 *
 * @param  {String} sectionName
 * The section at which the circularity was determined.
 *
 * @param  {String[]} path
 * The circular sections path.
 *
 * @return {Error} Our beautiful error.
 */
function circularSectionsError(sectionName, path) {
  const joinedPath = path.join(' -> ')
  const message = `Circular sections! Path: ${joinedPath} -> [${sectionName}]`
  return new Error(message)
}

/**
 * Composes sections together recursively.
 *
 * Example declaration:
 *
 * ```yaml
 * web:
 *   DB_HOST: 'localhost'
 * auth:
 *   FB_CLIENT_ID: 123
 * development:
 *   compose: [web, auth]
 * tests:
 *   compose: development
 *   FB_CLIENT_ID: 456
 * ```
 *
 * @param  {Object} root
 * The root object containing sections.
 *
 * @param  {String[]} sectionsToCompose
 * Array of strings that map to sections in the root object.
 *
 * @return {Object}
 * A composed object.
 */
module.exports = function composeSections(root, sectionsToCompose, state) {
  if (!sectionsToCompose || sectionsToCompose.length === 0) return {}

  // Passed along in the recursive call.
  state = state || {
    // Used for tracking circular sections.
    sectionTracker: []
  }

  const composedObject = {}
  const sections = sectionsToCompose.concat([])

  // So imperative.. If you can make this "Functional As Fuck™",
  // please make a PR. :)
  while (sections.length > 0) {
    const sectionName = sections[0]
    if (state.sectionTracker.indexOf(sectionName) > -1) {
      throw circularSectionsError(sectionName, state.sectionTracker)
    }

    const section = root[sectionName]
    state.sectionTracker.push(sectionName)
    if (section) {
      Object.assign(
        composedObject,
        composeSections(root, [].concat(section[COMPOSE_SYMBOL] || []), state),
        section
      )
      delete composedObject[COMPOSE_SYMBOL]
    }

    state.sectionTracker.pop()
    sections.shift()
  }

  return composedObject
}
