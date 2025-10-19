module.exports = {
  apps: [
    {
      name: 'auth-service',
      script: 'npm',
      args: 'start',
      cwd: './authentication_service',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'device-service',
      script: 'npm',
      args: 'start',
      cwd: './device_service',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'device-data-service',
      script: 'npm',
      args: 'start',
      cwd: './device_data_service',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'home-service',
      script: 'npm',
      args: 'start',
      cwd: './home_service',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'alert-service',
      script: 'npm',
      args: 'start',
      cwd: './alert_service',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
