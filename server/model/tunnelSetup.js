const createTunnel = await import("tunnel-ssh"); // Replace with the actual import
import "dotenv/config";

// Define tunnel, server, SSH, and forwarding options
const tunnelOptions = {
  // Define any specific tunnel server options if needed
};

const serverOptions = {
  port: 3333, // Local port to listen on for the tunnel
  host: "127.0.0.1",
};


// console.log("process.env test:\n ", process.env.DB_HOST, "\nend of log");

const sshOptions = {
  username: process.env.DB_HOST_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_HOST_PASSWORD,
  port: 22,
};

const forwardOptions = {
  srcAddr: "127.0.0.1",
  srcPort: 3333,
  dstAddr: "127.0.0.1", // Destination address (the DB server from SSH server's perspective)
  dstPort: 3306, // Destination port (the DB server's port, usually 3306 for MySQL)
};

// Function to set up the SSH tunnel
export const setupSshTunnel = () => {
  return createTunnel.createTunnel(
    tunnelOptions,
    serverOptions,
    sshOptions,
    forwardOptions
  );
};

// module.exports = setupSshTunnel;
