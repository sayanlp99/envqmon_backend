module.exports = {
  apps: [
    {
      name: 'api-gateway',
      script: 'npm',
      args: 'start',
      cwd: './api_gateway',
      env: {
        NODE_ENV: 'production'
      }
    },
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
      name: 'user-service',
      script: 'npm',
      args: 'start',
      cwd: './user_service',
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
    }
  ]
};
