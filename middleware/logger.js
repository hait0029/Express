
const logger = (req, res, next) => {
    const tmstmp = new Date().toLocaleString("da-DK");
    res.on("finish", () => {
        console.log(`${tmstmp} ${req.method} ${req.url} ${res.statusCode} ${res.statusMessage}`);
    })
    
    next();
}

module.exports = logger