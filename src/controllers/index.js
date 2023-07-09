const Index = class {
    index = async (req, res) => {
        return res.status(200).json({
            message: 'Welcome to the API',
            version: "1.0.0",
            data: {
                ip: req.ip, 
                "user-agent": req.headers["user-agent"],
                referrer: req.headers["referrer"],
                cookies: req.cookies,
            }
        })
    }
}

module.exports = new Index;