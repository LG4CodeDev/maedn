const Datastore = require('nedb');
exports.echo = new Datastore({ filename: './databases/echo.db', autoload: true });
