module.exports = {
  apps : [{
    name: 'AC Quest Manager',

    cwd: '/home/e_visloukhov/dnd-quest-server/',
    script: './server/server.js',
    instances: 0,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
