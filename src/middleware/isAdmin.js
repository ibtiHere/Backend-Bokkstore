// middleware to check the user is admin or not

module.exports = isAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}