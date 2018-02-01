'use strict'

const path = require('path')
const merge = require('deep-extend')

const loadAndParse = require('./loadAndParse')

// Import symbol key.
const IMPORT_SYMBOL = '~import'
// Require symbol key
const REQUIRE_SYMBOL = '~require'

/**
 * Constructs a circular imports error.
 *
 * @param  {string} fileBeingImported
 * The file being imported.
 *
 * @param  {string} importingFile
 * The file that imported.
 *
 * @return {Error}
 * An error.
 */
function circularImportsError(fileBeingImported, importTrail) {
  const message =
    `Circular import of "${fileBeingImported}".\r\n` +
    'Import trace:\r\n' +
    importTrail.map(f => ` -> ${f}`).join('\r\n')
  return new Error(message)
}

/**
 * Processes import statements.
 *
 * @param  {object} obj
 * The object to process imports on.
 *
 * @param  {object} opts
 * Options.
 *
 * @param {string} opts.importingFile
 * Required! Used to base import cwd's.
 *
 * @return {object}
 * The merged sections
 */
module.exports = function processImports(parsed, opts, state) {
  // Since this function is recursive, we pass state along
  state = state || {
    importTrail: [],
    loadedFiles: []
  }

  state.loadedFiles.push(opts.importingFile)
  state.importTrail.unshift(opts.importingFile)

  // Helper to check if we have already loaded the given file.
  const hasLoadedFile = f => state.loadedFiles.indexOf(f) > -1

  // We need to reverse the order to get the last imported file to win over earlier
  // imported files. This is because the outer file is merged onto the inner one,
  // so if we did not reverse then the first imported file would win.
  const files = [
    ...mapFiles(parsed[IMPORT_SYMBOL], opts.importingFile, false),
    ...mapFiles(parsed[REQUIRE_SYMBOL], opts.importingFile, true)
  ].reverse()
  delete parsed[IMPORT_SYMBOL]
  delete parsed[REQUIRE_SYMBOL]
  return files.reduce((processed, descriptor) => {
    if (hasLoadedFile(descriptor.file)) {
      throw circularImportsError(descriptor.file, state.importTrail)
    }
    const loaded = loadAndParse(descriptor.file, !descriptor.required)
    const loadedAndProcessed = processImports(
      loaded,
      Object.assign({}, opts, { importingFile: descriptor.file }),
      Object.assign({}, state, {
        importTrail: [...state.importTrail]
      })
    )

    // Make sure all top-level nodes are not null (empty sections)
    Object.keys(processed).forEach(key => {
      const value = processed[key]
      if (value === null) {
        processed[key] = {}
      }
    })

    return merge(loadedAndProcessed, processed)
  }, parsed)
}

/**
 * Maps file paths as well as whether not they are required to descriptors.
 */
function mapFiles(files, relative, required) {
  if (!files) {
    return []
  }

  if (Array.isArray(files) === false) {
    files = [files]
  }

  return files.map(f => ({
    file: resolvePath(relative, f),
    required: required
  }))
}

/**
 * Resolves a path relative to another.
 */
function resolvePath(relative, file) {
  return path.resolve(path.dirname(relative), file)
}
