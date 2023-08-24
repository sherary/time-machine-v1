const { users } = require('../databases/models/index');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { KEY, IV, JWT_SECRET_KEY } = process.env;
const iv_key = Buffer.from(IV, 'hex');
const key = Buffer.from(KEY, 'hex');
const crypto = require('crypto');
const algo = 'aes-256-cbc';

const getUserByEmail = async (email) => {
    try {
        const user = await users.findOne({
            where: {
                email: email
            },
            raw: true
        });

        return user
    } catch (err) {
        return err
    }
}

const getUserByID = async (id) => {
    try {
        const user = await users.findOne({
            where: {
                id: id
            },
            raw: true
        });

        return user
    } catch (err) {
        return err
    }
}

const getUserByUsername = async (username) => {
    try {
        const user = await users.findOne({
            where: {
                username: username
            },
            raw: true
        });
        
        return user
    } catch (err) {
        return err
    }
}

const getUserByColumnAndID = async (model, column) => {
    try {
        const user = await model.findOne({
            where: {
                userID: column
            },
            raw: true
        });
        
        return user
    } catch (err) {
        return err
    }
}

const encrypt = (data) => {
    let cipher = crypto.createCipheriv(algo, key, iv_key);
    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

const decrypt = (data) => {
    let decipher = crypto.createDecipheriv(algo, key, iv_key);
    let decrypted = decipher.update(data, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

const generateToken = (data) => {
    return jwt.sign(data, JWT_SECRET_KEY);
}

const decodeToken = (headers) => {
    let error = {};
    try {
        const authHeader = headers['authorization'];
        if (!authHeader) {
            error['code'] = 400
            error['message'] = "No token provided";
            return error
        } else {
            const regex = new RegExp('\\b' + "Bearer" + '\\b\\s*', 'gi');
            const token = authHeader.replace(regex, '');
            
            if (token.length < 210) {
                error['code'] = 400;
                error['message'] = "Please provide a correct token";
                return error
            }

            const user = jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
                if (err) {
                    error['code'] = 500
                    error['message'] = "Token internal error";
                    return error
                }
                
                return user;
            })
        
            return user
        }
    } catch (err) {
        error['code'] = 500
        error['message'] = err
        return error
    }
}

const responseHandler = (code, message, data) => {
    const response = {};
    response['code'] = code;
    response['message'] = message;
    response['data'] = data

    return response;
}

module.exports = { getUserByEmail, getUserByID, getUserByUsername, getUserByColumnAndID, encrypt, decrypt, generateToken, decodeToken, responseHandler }