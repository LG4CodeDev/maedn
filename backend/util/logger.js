exports.logToConsole = (req, res, next) => {
    console.log(`${req.method} Request on ${req.url}`);
    next();
}
