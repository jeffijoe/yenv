# yenv

[![npm version](https://badge.fury.io/js/yenv.svg)](https://badge.fury.io/js/yenv)
[![Dependency Status](https://david-dm.org/jeffijoe/yenv.svg)](https://david-dm.org/jeffijoe/yenv)

Manage environment stuff with YAML.

## Installation

```
npm install --save yenv
```

*Requires node v4.x or above.*

## Usage

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

# Author

Jeff Hansen - [@Jeffijoe](https://twitter.com/Jeffijoe)