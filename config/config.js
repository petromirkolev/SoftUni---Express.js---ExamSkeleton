module.exports = {
    development: {
        port: process.env.PORT || 3000,
        privateKey: 'schhhhwepps',
        saltRounds: 10,
        cookie: 'x-auth-token',
        databaseUrl: 'mongodb://localhost:27017/tutorials'
    },
    production: {}
};