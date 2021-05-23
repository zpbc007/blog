module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('db_host', 'localhost'),
        port: env.int('db_port', 5432),
        database: env('db_name', 'strapi'),
        username: env('db_user', 'strapi'),
        password: env('db_password', 'strapi'),
      },
    },
  },
});
