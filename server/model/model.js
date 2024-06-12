import { setupSshTunnel, setupSshTunnel_MGR } from "./tunnelSetup.js";
const bcrypt = await import ('bcrypt');
const crypto = await import('crypto');
import "dotenv/config";
import mysql from "mysql2/promise";
// import { markConversationDeleted } from "../controllers/conversations.js";

let pool; // Declare a variable to hold the database connection pool
let pool_EIMS_MGR;

const initializeDbConnection_EIMS3 = async () => {
  if (!pool) {
    await setupSshTunnel();
    pool = mysql.createPool({
      host: "127.0.0.1",
      port: 3333, // Local port where the SSH tunnel is established
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "EIMS3",
      waitForConnections: true,
      enableKeepAlive: true,
      keepAliveInitialDelay: 30000,
      connectionLimit: 100,
      queueLimit: 0,
    });
  }
  return pool;
};

const initializeDbConnection_EIMS3_MGR = async () => {
  if (!pool_EIMS_MGR) {
    await setupSshTunnel_MGR();
    pool_EIMS_MGR = mysql.createPool({
      host: "127.0.0.1",
      port: 3334, // Local port where the SSH tunnel is established
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: "EIMS3_MGR",
      waitForConnections: true,
      enableKeepAlive: true,
      keepAliveInitialDelay: 30000,
      connectionLimit: 100,
      queueLimit: 0,
    });
  }
  return pool_EIMS_MGR;
};

const extractValuesFromArray = async (arr) => {
  return arr.map((obj) => Object.values(obj)[0]);
};

const model = async () => {
  //pool to connect to eims3
  let poolPromise = initializeDbConnection_EIMS3();
  let pool = await poolPromise;

  //database connection for password verification
  let poolPromise_MGR = initializeDbConnection_EIMS3_MGR();
  let pool_EIMS_MGR = await poolPromise_MGR;

  const showTables = async () => {
    try {
      const query = `SHOW TABLES LIKE 'tbRecvRcd_202%';`;
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error in showTables:", error);
      return null;
    }
  };
  

  const ensureFieldsExist = async (tableName) => {
    try {
      // Check if the isRead column exists
      const checkIsReadQuery = `SHOW COLUMNS FROM ${tableName} LIKE 'isRead';`;
      const [isReadResult] = await pool.query(checkIsReadQuery);

      // Check if the isDeleted column exists
      const checkIsDeletedQuery = `SHOW COLUMNS FROM ${tableName} LIKE 'isDeleted';`;
      const [isDeletedResult] = await pool.query(checkIsDeletedQuery);

      // If the isRead column does not exist, add it
      if (isReadResult.length === 0) {
        const addIsReadColumnQuery = `ALTER TABLE ${tableName} ADD COLUMN isRead BOOLEAN DEFAULT FALSE;`;
        await pool.query(addIsReadColumnQuery);
        console.log(`Added isRead column to ${tableName}`);
      }

      // If the isDeleted column does not exist, add it
      if (isDeletedResult.length === 0) {
        const addIsDeletedColumnQuery = `ALTER TABLE ${tableName} ADD COLUMN isDeleted BOOLEAN DEFAULT FALSE;`;
        await pool.query(addIsDeletedColumnQuery);
        console.log(`Added isDeleted column to ${tableName}`);
      }
    } catch (error) {
      console.error(`Error ensuring isRead and isDeleted fields in ${tableName}:`, error);
    }
  };

  //function to mark messages as read or unread
  const markMessageRead = async (keyId, isRead) => {
    try {
      const query = `UPDATE tbChatHistory SET isRead = ? WHERE keyId = ?`;
      await pool.query(query, [isRead, keyId]);
    } catch (error) {
      console.error("Error marking message as read/unread:", error);
    }
  };

  //function to mark messages as deleted or not
  const markMessageDeleted = async (keyId, isDeleted) => {
    try {
      const query = `UPDATE tbChatHistory SET isDeleted = ? WHERE keyId = ?`;
      await pool.query(query, [isDeleted, keyId]);
    } catch (error) {
      console.error("Error marking message as deleted/undeleted:", error);
    }
  };
  
  const markConversationDeleted = async (phoneNumber, isDeleted) => {
    try {
      const query = `
        UPDATE tbChatHistory
        SET isDeleted = ?
        WHERE sender = ? OR receiver = ?;
      `;
      await pool.query(query, [isDeleted, phoneNumber, phoneNumber]);

      const queryRecvRcd = `
        UPDATE tbRecvRcd
        SET isDeleted = ?
        WHERE sender = ? OR receiver = ?;
      `;
      await pool.query(queryRecvRcd, [isDeleted, phoneNumber, phoneNumber]);

      const tables = await showTables();
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        const queryHistorical = `
          UPDATE ${tableName}
          SET isDeleted = ?
          WHERE sender = ? OR receiver = ?;
        `;
        await pool.query(queryHistorical, [isDeleted, phoneNumber, phoneNumber]);
      }
    } catch (error) {
      console.error("Error marking conversation as deleted/undeleted:", error);
    }
  };
  
  const markConversationRead = async (phoneNumber, isRead) => {
    console.log("markConversationRead", phoneNumber, isRead);
    try {
      const query = `
        UPDATE tbChatHistory
        SET isRead = ?
        WHERE sender = ? OR receiver = ?;
      `;
      await pool.query(query, [isRead, phoneNumber, phoneNumber]);

      const queryRecvRcd = `
        UPDATE tbRecvRcd
        SET isRead = ?
        WHERE sender = ? OR receiver = ?;
      `;
      await pool.query(queryRecvRcd, [isRead, phoneNumber, phoneNumber]);

      const tables = await showTables();
      for (const table of tables) {
        const tableName = Object.values(table)[0];
        const queryHistorical = `
          UPDATE ${tableName}
          SET isRead = ?
          WHERE sender = ? OR receiver = ?;
        `;
        await pool.query(queryHistorical, [isRead, phoneNumber, phoneNumber]);
      }
    } catch (error) {
      console.error("Error marking conversation as read/unread:", error);
    }
  };


  const queryJoineAllTables = async (keyId, sender) => {
    try {
      let a = await showTables();
      if (a && a.length > 0) {
        a = await extractValuesFromArray(a);
        let subQuery = ``;
        let andSender = sender === "1=1" ? "" : `AND sender = ${sender}`;
        let andReceiver = sender === "1=1" ? "" : `AND receiver = ${sender}`;
        if (a.length > 0)
          for (let i = 0; i < a.length; i++) {
            let tmpUnionClause = i != a.length - 1 ? ` UNION ALL ` : ``;
            subQuery += `
                            SELECT keyId, sender, receiver, recvTm, portNum, sms, hasGet
                            FROM ${a[i]}
                            WHERE idxUserId = ${keyId}
                            ${andSender}
                            ${tmpUnionClause}
                            `;
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
        return;
      }
    } catch (error) {
      console.error("Error in joinMessages:", error);
      return null;
    }
  };
  //fetches the days messages and updates from this table
  const fetchCurrentDayMessages = async (keyId) => {
    try {
      const query = `SELECT * FROM tbRecvRcd WHERE idxUserId = ${mysql.escape(
        keyId
      )} ORDER BY recvTm DESC`;
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Error fetching current day messages:", error);
      throw error;
    }
  };

  
  const fetchMessagesMine = async (keyId) => {
    console.log("Loading messages of new user...");
    try {
      // Fetch the list of historical tables
      let historicalTables = await showTables();
      if (historicalTables && historicalTables.length > 0) {
        historicalTables = await extractValuesFromArray(historicalTables); // Convert rows to table names

        // Ensure isRead and isDeleted field exists in tbChatHistory and tbRecvRcd
        await ensureFieldsExist("tbChatHistory");
        await ensureFieldsExist("tbRecvRcd");


        // Start subQuery with messages from tbChatHistory and tbRecvRcd
        let subQuery = `SELECT keyId, receiver AS sender, sender AS receiver, recvTm, portNum, sms, hasGet, isRead, isDeleted
                                FROM tbChatHistory
                                WHERE idxUserId = ${mysql.escape(keyId)} AND isDeleted = 0
                                UNION ALL
                                SELECT keyId, sender, receiver, recvTm, portNum, sms, hasGet, isRead, isDeleted
                                FROM tbRecvRcd
                                WHERE idxUserId = ${mysql.escape(keyId)}
                                UNION ALL `;

        // Append each historical table to the union query
        for (let i = 0; i < historicalTables.length; i++) {
          subQuery += `
                        SELECT keyId, sender, receiver, recvTm, portNum, sms, hasGet, isRead, isDeleted
                        FROM ${historicalTables[i]}
                        WHERE idxUserId = ${mysql.escape(keyId)} AND isDeleted = 0
                    `;
          if (i < historicalTables.length - 1) {
            subQuery += " UNION ALL "; // Add UNION ALL except after the last table
          }
        }

        // Execute the query and order all results by receive time in descending order
        const [combinedMessages] = await pool.query(
          `${subQuery} ORDER BY recvTm DESC`
        );

        // Check if any messages were fetched and return them
        if (combinedMessages.length > 0) {
          console.log("Fetched messages:", combinedMessages.length);
          return combinedMessages;
        } else {
          console.log("No messages found.");
          return null;
        }
      } else {
        console.log("No historical tables found, querying only current tables.");
        // If no historical tables exist, query only current tables
        await ensureFieldsExist("tbChatHistory");
        await ensureFieldsExist("tbRecvRcd");
        const [currentMessages] = await pool.query(`
                    SELECT keyId, receiver AS sender, sender AS receiver, recvTm, portNum, sms, hasGet, isRead, isDeleted
                    FROM tbChatHistory
                    WHERE idxUserId = ${mysql.escape(keyId)} 
                    UNION ALL
                    SELECT keyId, sender, receiver, recvTm, portNum, sms, hasGet, isRead, isDeleted
                    FROM tbRecvRcd
                    WHERE idxUserId = ${mysql.escape(keyId)} 
                    ORDER BY recvTm DESC
                `);
        return currentMessages;
      }
    } catch (error) {
      console.error("Error in fetchMessagesMine:", error);
      return null; // Return null in case of an error
    }
  };

  return {
    getUserByKeyId: async (keyId) => {
      const query = "SELECT keyID, name, password FROM tbUser WHERE keyID = ?";
      const [rows] = await pool.query(query, [keyId]);
      return rows.length > 0 ? rows[0] : null;
    },
    getUserByUsername: async (username) => {
      const query = "SELECT keyID, name, password FROM tbUser WHERE name = ?";
      const [rows] = await pool.query(query, [username]);
      return rows.length > 0 ? rows[0] : null;
    },

    saveMsg: async (reqBody) => {

      console.log("Model-325: SaveMsg: m-m-sender", reqBody.sebder, reqBody.receiver); console
      const insertQuery =
        "INSERT INTO tbChatHistory (idxUserId, sms, sender, receiver, portNum) VALUES (?, ?, ?, ?, ?)";
      try {
        const [insertResults] = await pool.query(insertQuery, [
          reqBody.id,
          reqBody.lastRow.sms,
          reqBody.lastRow.sender,
          reqBody.lastRow.receiver,
          reqBody.lastRow.portNum,
        ]);

        // Get the inserted row ID
        const insertedRowId = insertResults.insertId;

        const selectQuery = "SELECT * FROM tbChatHistory WHERE keyId = ?";
        const [selectRows] = await pool.query(selectQuery, [insertedRowId]);

        // Return the fetched data
        return selectRows;
      } catch (error) {
        console.error("Error inserting or fetching data:", error);
        return null;
      }
    },

    validateCredentials: async (keyUserId, password) => {
      const query = "SELECT password FROM tbCfrmUser WHERE keyUserId = ?"; // Adjust if the column name for the hashed password is different
      const [rows] = await pool_EIMS_MGR.query(query, [keyUserId]); // Use the connection pool to execute the query

      if (rows.length > 0) {
        const user = rows[0];
        // Ensure that user.password (or the correct field for the hash) is not undefined
        if (user.password) {
          
          // const isValid = await bcrypt.compare(password, user.password); // Correct field used in comparison
          const md5Hash = crypto
            .createHash("md5")
            .update(password)
            .digest("hex");
          
          if (md5Hash === user.password) {
            return true;
          }
        }

        return false;
      }
    },

    getUsersAndLastMessages: async (keyId) => {
      try {
        let a = await fetchMessagesMine(keyId);
        if (a && a.length > 0) {
          console.log("model-376:", a[0]);
          return a;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error in getTestMessages:", error);
        return null;
      }
    },

    UpdateMsgs: async (data) => {
      console.log("model-388:Updating messages...", data);
      try {
        let tmpQuery = await queryJoineAllTables(data.id, "1=1");
        // tmpQuery = tmpQuery.replace(/\n/g, '') + ` WHERE (recvTm > '2024-04-10 21:30:55' OR (recvTm = '2024-04-10 21:30:55' AND keyId > ${lastKeyId}))
        // ORDER BY recvTm, keyId`;
      } catch (error) {
        console.error("Error in saveMessage:", error);
        return null;
      }
    },
    markConversationDeleted,
    markConversationRead,
  };
};

export default model;
