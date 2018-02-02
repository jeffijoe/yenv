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

_Requires node v6.x or above._

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
const yenv = require('yenv')

// Default filename is env.yaml.
const env = yenv()

// You can call it with a filename, too.
const env = yenv('env.yaml')

// The top-level element in the YAML-file is used to
// read the correct set of variables. The value is grabbed
// from `process.env.NODE_ENV`. To explicitly specify it, use:
const env = yenv('env.yaml', { env: 'production' })

console.log(env.PORT)
console.log(env.DROP_DATABASE)
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

`yenv` supports importing files recursively, with the importer winning in case of duplicate variables. _Paths are resolved relative to the importing file!_

There are 2 ways to import:

* `~require: [file1.yaml, file2.yaml]` - imports `file1.yaml` and `file2.yaml`. If a file does not exist, it throws an error.
* `~import: [file1.yaml, file2.yaml]` - imports `file1.yaml` and `file2.yaml`. If a file does not exist, it acts as if it was empty.

> **Note**: In `v1.x`, `~import` would throw an error if the file does not exist. From `v2.x` you can use `~require` for that behavior.

_database.yaml_

```yaml
development:
  DB_HOST: localhost
```

_web.yaml_

```yaml
development:
  PORT: 1337
production:
  PORT: 80
```

_env.yaml_

```yaml
~require: [database.yaml, web.yaml]
development:
  PORT: 3000 # This wins over web.yaml because this is the importer.
```

```javascript
const env = yenv()
env.DB_HOST // "localhost"
env.PORT // 3000
```

As mentioned earlier, in case of clashes _the importer always wins_. However, when it comes to 2 files being imported, the last one specified wins (but still not over the importer).

**ProTip:** You can use `~compose` on sections defined in imported files. Example:

_stuff.yaml_

```yaml
cool-section:
  STUFF: 'yenv is the best'
```

_env.yaml_

```yaml
~require: stuff.yaml
development:
  ~compose: cool-section
```

# TypeScript

Typings are available in `lib/yenv.d.ts` and are set in `package.json`.

To import `yenv` in TypeScript:

```typescript
import * as yenv from 'yenv'
```

# Changelog

Please see [CHANGELOG.md](CHANGELOG.md).

# Author

Jeff Hansen - [@Jeffijoe](https://twitter.com/Jeffijoe)
