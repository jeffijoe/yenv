'use strict';

const path = require('path');
const merge = require('deep-extend');

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
  // Since this function is recursive, we pass state along in the opts.
  opts.__loadedFiles = opts.__loadedFiles || [];
  opts.__importTrail = opts.__importTrail || [];

  opts.__loadedFiles.push(opts.importingFile);
  opts.__importTrail.unshift(opts.importingFile);

  // Helper to check if we have already loaded the given file.
  const hasLoadedFile = f => opts.__loadedFiles.indexOf(f) > -1;

  const imports = parsed[IMPORT_SYMBOL];
  if (!imports) return parsed;

  // Resolve the paths so they are relative to the importing file.
  // NOTE: We reverse the order so that the last file being imported wins
  // (although it never wins over the importer!)
  const filesToImport = [].concat(imports).reverse().map(
    f => path.resolve(path.dirname(opts.importingFile), f)
  );

  let processed = parsed;
  filesToImport.forEach(p => {
    delete processed[IMPORT_SYMBOL];

    // Check for circular imports.
    if (hasLoadedFile(p)) throw circularImportsError(p, opts.__importTrail);

    const loaded = loadAndParse(p);
    let loadedAndProcessed = processImports(
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

    // Make sure all top-level nodes are not null.
    Object.keys(processed).forEach(key => {
      const value = processed[key];
      if (value === null) {
        processed[key] = {};
      }
    });

    // Deep merge them together, the outermost one winning.
    processed = merge(loadedAndProcessed, processed);
  });

  return processed;
};