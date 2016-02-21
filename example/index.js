const yenv = require('yenv');

function printEnv(name, env) {
  console.log(name, '- Dev-mode:', env.DEV_MODE);
  console.log(name, '- Port:', env.PORT);
  console.log(name, '- Secret:', env.SECRET);
}

// Development
const devEnv = yenv();
printEnv('dev', devEnv);

// Just to illustrate...
process.env.SECRET = 'hax';

// Production
const prodEnv = yenv('env.yaml', { env: 'production' });
printEnv('prod', prodEnv);