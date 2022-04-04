const echoModel = require('../models/echo');

exports.saveEcho = (message, callback) => {
    echoModel.createEchoLog(message, (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}
exports.listEchos = (containsString, callback) => {
    echoModel.queryEchos(containsString, (err, data) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    });
}
