'use strict';

const path = require('path');
const merge = require('deepmerge');

const loadAndParse = require('./loadAndParse');

// Import symbol key.
const IMPORT_SYMBOL = '~import';

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
  const message = `Circular import of "${fileBeingImported}".\r\n`
    + 'Import trace:\r\n'
    + importTrail.map(f => ` -> ${f}`).join('\r\n');
  return new Error(message);
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
module.exports = function processImports(parsed, opts) {
  opts.__loadedFiles = opts.__loadedFiles || [];
  opts.__importTrail = opts.__importTrail || [];

  opts.__loadedFiles.push(opts.importingFile);
  opts.__importTrail.unshift(opts.importingFile);

  // Helper to check if we have already loaded the given file.
  const hasLoadedFile = f => opts.__loadedFiles.indexOf(f) > -1;

  const imports = parsed[IMPORT_SYMBOL];
  if (!imports) return parsed;

  const filesToImport = [].concat(imports).map(
    f => path.resolve(path.dirname(opts.importingFile), f)
  );

  let processed = parsed;
  filesToImport.forEach(p => {
    delete processed[IMPORT_SYMBOL];

    // Check for circular imports.
    if (hasLoadedFile(p)) throw circularImportsError(p, opts.__importTrail);
    const loaded = loadAndParse(p);
    const loadedAndProcessed = processImports(
      loaded,
      Object.assign(
        {},
        opts,
        {
          // The importing file is now the one being processed.
          importingFile: p,
          // We have to create a new import trail
          // based on the current one.
          __importTrail: opts.__importTrail.concat([])
        }
      )
    );

    // Deep merge them together, the outermost one winning.
    processed = merge(loadedAndProcessed, processed);
  });

  return processed;
};