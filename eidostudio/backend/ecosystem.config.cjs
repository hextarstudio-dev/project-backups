module.exports = {
  apps: [
    {
      name: 'eidos-backend',
      script: 'dist/server.js',
      cwd: '/home/josmarcdesign/Projetos/eidostudio/backend-site-studio',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      restart_delay: 3000,
      watch: false,
      min_uptime: 5000,
      max_memory_restart: '500M',
      max_restarts: 20,
      exp_backoff_restart_delay: 200,
      env: {
        NODE_ENV: 'production',
        PORT: 8790
      }
    }
  ]
};
