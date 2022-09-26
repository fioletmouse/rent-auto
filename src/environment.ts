export const environment = {
  pgCredentials: {
    user: 'eakulenko',
    host: 'localhost',
    database: 'hyundai-rent',
    password: '135790',
    port: 5432,
  },
  corsRegex: '^(http(s)?:\/\/)(www\.)?(localhost:[0-9]{4,5})(\/.*)*?$',
  port: '3000',
  swagger: {
    title: 'rent-service',
    description: 'The rent-service API description',
    version: '1.0',
    path: 'rent/api'
  },
};
