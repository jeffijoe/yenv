# yenv

[![npm version](https://badge.fury.io/js/yenv.svg)](https://badge.fury.io/js/yenv)
[![Dependency Status](https://david-dm.org/jeffijoe/yenv.svg)](https://david-dm.org/jeffijoe/yenv)
[![Build Status](https://travis-ci.org/jeffijoe/yenv.svg?branch=master)](https://travis-ci.org/jeffijoe/yenv)
[![Coverage Status](https://coveralls.io/repos/github/jeffijoe/yenv/badge.svg?branch=master)](https://coveralls.io/github/jeffijoe/yenv?branch=master)

Manage environment stuff with YAML.

# Installation

```
npm install --save yenv
```

*Requires node v4.x or above.*

# Usage

Declaring variables in a file (eg. `env.yaml`):

```yaml
# Development-specific settings.
development:
  PORT: 3000
  DROP_DATABASE: true
# Production-specific settings.
production:
  PORT: 80
  DROP_DATABASE: false
```

Reading the file:

```javascript
const yenv = require('yenv');

// Default filename is env.yaml.
const env = yenv();

// You can call it with a filename, too.
const env = yenv('env.yaml');

// The top-level element in the YAML-file is used to
// read the correct set of variables. The value is grabbed
// from `process.env.NODE_ENV`. To explicitly specify it, use:
const env = yenv('env.yaml', { env: 'production' });

console.log(env.PORT);
console.log(env.DROP_DATABASE);
```

## Environment variables

When a variable is defined in the environment, it will take precedence over
whatever was defined in the yaml-file.
This means that if your hosting provider (Heroku, Azure, whatever...) sets the
`PORT` variable, then that's the variable that will be used.

_Sensitive configuration should **always** be defined in the actual environment variables and not committed to source control!_

## Composition

`yenv` supports composing sections together. This is best illustrated with a code example.

```yaml
# Some base config..
base:
  SOME_URL: 'http://google.com'

# Another section, related to the web config..
web:
  PORT: 1338

# Development config uses base config
development:
  # We can compose more than one at a time.
  ~compose: [base, web]
  # Declare additional settings..
  DEV_MODE: true

# Production config composes and overrides other sections
production:
  ~compose: development
  PORT: 80
  DEV_MODE: false
```

## Importing

`yenv` supports importing files recursively, with the importer winning in case of duplicate variables. *Paths are resolved relative to the importing file!*

*database.yaml*

```yaml
development:
  DB_HOST: localhost
```

*web.yaml*

```yaml
development:
  PORT: 1337
production:
  PORT: 80
```

*env.yaml*

```yaml
~import: [database.yaml, web.yaml]
development:
  PORT: 3000 # This wins over web.yaml because this is the importer.
```

```javascript
const env = yenv();
env.DB_HOST; // "localhost"
env.PORT; // 3000
```

As mentioned earlier, in case of clashes *the importer always wins*. However, when it comes to 2 files being imported, the last one specified wins (but still not over the importer).

**ProTip:** You can use `~compose` on sections defined in imported files. Example:

*stuff.yaml*

```yaml
cool-section:
  STUFF: 'yenv is the best'
```

*env.yaml*

```yaml
~import: stuff.yaml
development:
  ~compose: cool-section
```

# TypeScript

Typings are available in `lib/yenv.d.ts` and are set in `package.json`.

To import `yenv` in TypeScript:

```typescript
import * as yenv from 'yenv';
```

# Changelog

Please see [CHANGELOG.md](CHANGELOG.md).

# Author

Jeff Hansen - [@Jeffijoe](https://twitter.com/Jeffijoe)