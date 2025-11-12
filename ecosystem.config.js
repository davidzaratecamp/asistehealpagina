module.exports = {
  apps: [
    {
      name: 'asiste-healthcare',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/asiste-healthcare',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '1G',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/www/asiste-healthcare/logs/err.log',
      out_file: '/var/www/asiste-healthcare/logs/out.log',
      log_file: '/var/www/asiste-healthcare/logs/combined.log'
    }
  ]
};