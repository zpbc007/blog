module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'ae862842427123962e087f76d75bfdb1'),
    },
  },
  url: 'https://strapi.callback.cool'
});
