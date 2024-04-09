const mysql = require('mysql2/promise');
const mariadb = require('mariadb')
const bcrypt = require('bcrypt');

const setupSshTunnel = require('./tunnelSetup');

require("dotenv").config();

// const dbHost = process.env.DB_HOST;
// const dbHostUser = process.env.DB_HOST_USER;
// const dbHostPass = process.env.DB_HOST_PASS;
// const dbUser = process.env.DB_USER;
// const dbPass = process.env.DB_PASS;

console.log(process.env.DB_USER, process.env.DB_HOST, process.env.DB_PASSWORD)
// Function to initialize the database connection
const initializeDbConnection = async () => {
    await setupSshTunnel(); // Setup SSH tunnel
    return mysql.createPool({
        host: '127.0.0.1',
        port: 3333, // Local port where the SSH tunnel is established
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'EIMS3',
        waitForConnections: true, // Helpful for managing connection timeouts
        connectionLimit: 10, // Adjust as needed
        queueLimit: 0 // No limit on queued requests
    });
};

let poolPromise = initializeDbConnection();


// SQL-based model functions
const model = {
    // Function to retrieve a user by username

    getUserByKeyId: async (keyId) => {
        // Directly use `pool` assuming it has been initialized
        const pool = await poolPromise;
        const query = 'SELECT keyID, name, password FROM tbUser WHERE keyID = ?';
        const [rows] = await pool.query(query, [keyId]);
        return rows.length > 0 ? rows[0] : null;
    },

    getUserByUsername: async (username) => {
        const pool = await poolPromise;
        const [rows] = await poolPromise.query('SELECT * FROM tbUser WHERE username = ?', [username]);
        console.log('Query result:', rows);
        return rows[0];
    },

    //Function to retrieve agent_id or token:
    getAgentId: async (username) => {
        const pool = await poolPromise;
        const [rows] = await pool.query('SELECT keyID FROM tbUser WHERE username = ?', [username]);
        if (rows.length === 0) {
            return null; // No agent found with the given identifier
        }
        return rows[0].agent_id;
    },

    // Function to validate user credentials
    validateCredentials: async (username, password) => {
        const pool = await poolPromise;
        const user = await model.getUserByUsername(username);
        if (!user) {
            return false; // User not found
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        console.log(validPassword);
        return validPassword;
    },

    // // Function to add a new message
    // addMessage: async (message, sender, receiver) => {
    //     const [result] = await pool.query('INSERT INTO Messages (message, sender, receiver, date) VALUES (?, ?, ?, NOW())', [message, sender, receiver]);
    //     return result.insertId;
    // },

    // // Function to retrieve messages for a user
    // getMessagesForUser: async (username) => {
    //     const [rows] = await pool.query('SELECT * FROM Messages WHERE receiver = ? OR sender = ?', [username, username]);
    //     return rows;
    // },

    // //lazy-load messages for a user
    // getMessagesForUser: async (agentId, limit, offset) => {
    //     const query = `
    //         SELECT 
    //             messages.content as message, 
    //             messages.timestamp as sentTime,
    //             messages.message_id as sender,
    //             messages.direction
    //         FROM messages 
    //         INNER JOIN iccid ON messages.iccid = iccid.iccid
    //         WHERE iccid.agent_id = ? 
    //         ORDER BY messages.timestamp DESC 
    //         LIMIT ? OFFSET ?`;

    //     const [rows] = await pool.query(query, [agentId, limit, offset]);
    //     return rows.map(row => ({
    //         message: row.message,
    //         sentTime: row.sentTime,
    //         sender: row.sender,
    //         direction: row.direction
    //     }));
    // },

    //Get the name of an agent by their ID (eventually by their token)
    getAgentNameById: async (keyId) => {
        const query = 'SELECT name FROM agents WHERE agent_id = ?';
        const [rows] = await pool.query(query, [agentId]);
        console.log(rows[0],345345);
        return rows[0]?.name;
    },


    getTestMessages: async (keyId) => {
        try {
            const pool = await poolPromise;
            const query = 'SELECT idxUserId, sender, recvTm, sms FROM tbRecvRcd_20240402 WHERE idxUserId = ? ORDER BY recvTm DESC LIMIT 15';
            const [rows, fields] = await pool.query(query, [keyId]);
    
            if (rows && rows.length > 0) {
                console.log('model.res.length:', rows.length);
                return rows;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error in getTestMessages:', error);
            return null;
        }
    }


};

module.exports = model;
