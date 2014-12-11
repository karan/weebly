var Constants = {
  // Key and secret used to connect to Google app, can't be shared
  Google: {
    KEY: process.env.google_key ||
        '962327310684-t6ukvb63cuqhvopjbgh0nbd0msd0jjcq.apps.googleusercontent.com',
    SECRET: process.env.google_secret ||
        'MIyiFLD485KZsMZQszhJyCbh',
    CALLBACK: process.env.google_cb ||
        '/oauth2callback'
  },
  mongooseURI: process.env.mongo ||
      'mongodb://heroku_app32181596:th3inpurlb54g7jqnbl1p0sevd@ds051640.mongolab.com:51640/heroku_app32181596',
  REDISTOGO_URL: process.env.redis_to_go ||
      'redis://redistogo:4362c5dc9f2d29b2d99e10c52e4737d0@viperfish.redistogo.com:9472/',
  MEMCACHIER: {
    'password': process.env.mc_pw || 'e33fee9875',
    'username': process.env.mc_user || 'e05fae',
    'servers': process.env.mc_servers || 'mc5.dev.ec2.memcachier.com:11211'
  }
};

module.exports = Constants;
