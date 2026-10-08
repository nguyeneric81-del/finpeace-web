module.exports = {
  apps: [
    {
      name: 'finpeace-price-updater',
      script: 'scripts/price_updater_daemon.js',
      cwd: '/Users/tuananhnguyen/workspace-gravity/finpeace-web',
      interpreter: 'node',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
