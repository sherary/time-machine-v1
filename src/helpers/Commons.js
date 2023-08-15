const { users } = require('../databases/models/index');
require('dotenv').config();
const { KEY, IV } = process.env;
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

module.exports = { getUserByEmail, getUserByID, getUserByUsername, getUserByColumnAndID, encrypt, decrypt }