const db = require('./db.js');

exports.createEchoLog = (message, callback) => {
    const doc = {
        message: message
    };
    db.echo.insert(doc, (err, newDoc) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, newDoc);
        }
    });
}
exports.queryEchos = (containsString, callback) => {
    db.echo.find(containsString ? { message: new RegExp(containsString) } : {}, (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}
