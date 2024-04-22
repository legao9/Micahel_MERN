import { setupSshTunnel } from './tunnelSetup.js';
import "dotenv/config";
import mysql from 'mysql2/promise';

let pool; // Declare a variable to hold the database connection pool

const initializeDbConnection = async () => {
    if (!pool) {
        await setupSshTunnel();
        pool = mysql.createPool({
            host: '127.0.0.1',
            port: 3333, // Local port where the SSH tunnel is established
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'EIMS3',
            waitForConnections: true,
            connectionLimit: 100,
            queueLimit: 0
        });
    }
    return pool;
};
const extractValuesFromArray = async (arr) => {
    return arr.map(obj => Object.values(obj)[0]);
}

const model = async () => {
    let poolPromise = initializeDbConnection();
    let pool = await poolPromise;

    const showTables = async () => {
        try {
            const query = `SHOW TABLES LIKE 'tbRecvRcd_202%';`;
            const [rows] = await pool.query(query);
            return rows;
        } catch (error) {
            console.error('Error in showTables:', error);
            return null;
        }
    };

    const queryJoineAllTables = async (keyId, sender) => {
        try {
            let a = await showTables();
            if (a && a.length > 0) {
                a = await extractValuesFromArray(a);
                let subQuery = ``;
                let andSender = (sender === '1=1') ? '' : `AND sender = ${sender}`;
                let andReceiver = (sender === '1=1') ? '' : `AND receiver = ${sender}`;
                if (a.length > 0)
                    for (let i = 0; i < a.length; i++) {
                        let tmpUnionClause = (i != a.length - 1) ? ` UNION ALL ` : ``;
                        subQuery += `
                            SELECT keyId, sender, receiver, recvTm, portNum, sms, hasGet
                            FROM ${a[i]}
                            WHERE idxUserId = ${keyId}
                            ${andSender}
                            ${tmpUnionClause}
                            `
                        }
                        
                        let tmpQuery = `SELECT keyId, sender, receiver, recvTm, portNum, sms, hasGet
                        FROM (
                            SELECT keyId, receiver AS sender, sender AS receiver, recvTm, portNum, sms, hasGet
                            FROM tbChatHistory
                            WHERE idxUserId = ${keyId}
                            ${andReceiver}
                            UNION ALL
                            ${subQuery}
                        ) AS all_tables`;
                // console.log('model-46-Joining...',keyId,sender,tmpQuery);
                return tmpQuery;
            } else {
                return ;
            }
        } catch (error) {
            console.error('Error in joinMessages:', error);
            return null;
        }
    }
    const fetchMessagesMine = async (keyId) => {
        console.log('Loading messages of new user...');
        try {
            let a = await showTables();
            if (a && a.length > 0) {
                a = await extractValuesFromArray(a);
                let subQuery = ``;
                if (a.length > 0)
                    for (let i = 0; i < a.length; i++) {
                        let tmpUnionClause = (i != a.length - 1) ? ` UNION ALL ` : ``;
                        subQuery += `
                            SELECT keyId, sender, receiver, recvTm, portNum, sms, hasGet
                            FROM ${a[i]}
                            WHERE idxUserId = ${keyId}
                            ${tmpUnionClause}
                        `
                    }

                let tmpQuery = `SELECT keyId, sender, receiver, recvTm, portNum, sms, hasGet
                                FROM (
                                    SELECT keyId, receiver AS sender, sender AS receiver, recvTm, portNum, sms, hasGet
                                    FROM tbChatHistory
                                    WHERE idxUserId = ${keyId}
                                    UNION ALL
                                    ${subQuery}
                                ) AS all_tables ORDER BY recvTm DESC`;
                const [rows] = await pool.query(tmpQuery);
                if (rows.length > 0) {
                    console.log(111,rows.length);
                    return rows;
                } else {
                    return null;
                }
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error in joinMessages:', error);
            return null;
        }
    }

    return {
        getUserByKeyId: async (keyId) => {
            const query = 'SELECT keyID, name, password FROM tbUser WHERE keyID = ?';
            const [rows] = await pool.query(query, [keyId]);
            return rows.length > 0 ? rows[0] : null;
        },
        getUserByUsername: async (username) => {
            const query = 'SELECT keyID, name, password FROM tbUser WHERE name = ?';
            const [rows] = await pool.query(query, [username]);
            return rows.length > 0 ? rows[0] : null;
        },

        saveMsg: async (reqBody) => {
            const insertQuery = 'INSERT INTO tbChatHistory (idxUserId, sms, sender, receiver, portNum) VALUES (?, ?, ?, ?, ?)';
            try {
              const [insertResults] = await pool.query(insertQuery, [reqBody.id, reqBody.lastRow.sms, reqBody.lastRow.sender, reqBody.lastRow.receiver, reqBody.lastRow.portNum]);
          
              // Get the inserted row ID
              const insertedRowId = insertResults.insertId;
          
              const selectQuery = 'SELECT * FROM tbChatHistory WHERE keyId = ?';
              const [selectRows] = await pool.query(selectQuery, [insertedRowId]);
          
              // Return the fetched data
              return selectRows;
            } catch (error) {
              console.error('Error inserting or fetching data:', error);
              return null;
            }
          },
        // validateCredentials: async (username, password) => {
        //     const query = 'SELECT keyID, name, password FROM tbUser WHERE name = ? AND password = ?';
        //     const [rows] = await pool.query(query, [username, password]);
        //     console.log('cvalidate-credentials', rows);
        //     return rows.length > 0 ? true : false;
        // },

        getUsersAndLastMessages: async (keyId) => {
            try {
                let a = await fetchMessagesMine(keyId);
                if (a && a.length > 0) {
                    console.log('model-88:', a[0]);
                    return a;
                } else {
                    return null;
                }

            } catch (error) {
                console.error('Error in getTestMessages:', error);
                return null;
            }
        },

        UpdateMsgs: async (data) => {
            console.log('model-163:Updating messages...',data);
            try{
                let tmpQuery = await queryJoineAllTables(data.id, '1=1');
                // tmpQuery = tmpQuery.replace(/\n/g, '') + ` WHERE (recvTm > '2024-04-10 21:30:55' OR (recvTm = '2024-04-10 21:30:55' AND keyId > ${lastKeyId}))
                // ORDER BY recvTm, keyId`;
                
            } catch (error) {
                console.error('Error in saveMessage:', error);
                return null;        
            }
        },
    };
};

export default model;