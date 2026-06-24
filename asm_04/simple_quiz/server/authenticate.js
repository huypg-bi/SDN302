const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Question = require('./models/Question');

exports.verifyUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        const err = new Error('No token provided');
        err.status = 401;
        return next(err);
    }

    const token = authHeader.split(' ')[1]; // Lấy token từ "Bearer <token>"
    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', async (err, decoded) => {
        if (err) {
            const error = new Error('Failed to authenticate token');
            error.status = 401;
            return next(error);
        }
        try {
            const user = await User.findById(decoded._id);
            if (!user) {
                const error = new Error('User not found');
                error.status = 401;
                return next(error);
            }
            req.user = user;
            next();
        } catch (e) {
            next(e);
        }
    });
};

exports.verifyAdmin = (req, res, next) => {
    if (req.user && req.user.admin) {
        return next();
    }
    const err = new Error('You are not authorized to perform this operation!');
    err.status = 403;
    return next(err);
};

exports.verifyAuthor = async (req, res, next) => {
    if (req.user && req.user.admin) return next();
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) {
            const err = new Error('Question not found');
            err.status = 404;
            return next(err);
        }
        if (question.author && question.author.equals(req.user._id)) {
            return next();
        }
        const err = new Error('You are not the author of this question');
        err.status = 403;
        return next(err);
    } catch (e) {
        next(e);
    }
};