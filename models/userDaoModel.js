const db = require('../db');
const Promise = require('bluebird')

const FIND_BY_CALENDLY_UID_SQL = `SELECT * FROM users WHERE id = ?`;
const FIND_BY_ID_SQL = `SELECT * FROM users WHERE id = ?`;
const FIND_BY_ACCESS_TOKEN_SQL = `SELECT * FROM users WHERE access_token = ?`;
const CREATE_SQL = `INSERT INTO users (calendly_uid, access_token, refresh_token) VALUES (?, ?, ?)`;
const UPDATE_SQL = `UPDATE users SET access_token = ?, refresh_token = ? WHERE id = ?`;

const x = new db('./calendly.sqlite3')

class UserModel {
    
    constructor(connection) {
        this.connection = connection;
    }

    getUserById(id) {
        // console.log(id)
        return this.connection.get(
            FIND_BY_CALENDLY_UID_SQL,
            [id])
    }

    async findOrCreate({ calendlyUid, refreshToken, accessToken }) {
        console.log(calendlyUid, refreshToken, accessToken)
        const user = this.findByCalendlyUserId(calendlyUid);

        if (user) return user;

        await this.create({
            calendlyUid,
            refreshToken,
            accessToken
        });

        return this.findByCalendlyUserId(calendlyUid);
    }

    async findByCalendlyUserId(calendlyUid) {
        const _ = new UserModel(x)  
        
        return new Promise((resolve, reject) => {
            _.getUserById(calendlyUid), (err, row) => {
                if(err) return reject(err);
                
                resolve(row)
            }
        });
    }

    async findById(id) {
        return new Promise((resolve, reject) => {
            db.get(FIND_BY_ID_SQL, [id], (err, row) => {
                if (err) return reject(err);

                resolve(row);
            });
        });
    }

    async findByAccessToken(accessToken) {
        return new Promise((resolve, reject) => {
            db.get(FIND_BY_ACCESS_TOKEN_SQL, [accessToken], (err, row) => {
                if (err) return reject(err);

                resolve(row);
            });
        });
    }

    async update(id, { accessToken, refreshToken }) {
        return new Promise((resolve, reject) => {
            db.run(UPDATE_SQL, [accessToken, refreshToken, id], (err, row) => {
                if (err) return reject(err);

                resolve(row);
            });
        });
    }

    async create({ calendlyUid, accessToken, refreshToken }) {
        return new Promise((resolve, reject) => {
            db.run(
                CREATE_SQL,
                [calendlyUid, accessToken, refreshToken],
                (err) => {
                    if (err) return reject(err);
                    resolve();
                }
            );
        });
    }
}

module.exports = new UserModel(db);
