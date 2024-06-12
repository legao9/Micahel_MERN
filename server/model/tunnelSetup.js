import createTunnel from 'tunnel-ssh';
import 'dotenv/config';

const tunnelOptions = {
  // Define any specific tunnel server options if needed
};

const sshOptions = {
  username: process.env.DB_HOST_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_HOST_PASSWORD,
  port: 22,
};

const forwardOptions = {
  srcAddr: "127.0.0.1",
  srcPort: 3333,
  dstAddr: "127.0.0.1",
  dstPort: 3306,
};

const serverOptions = {
  port: 3333, // Local port to listen on for the tunnel
  host: "127.0.0.1",
};

const maxRetries = 5;
const reconnectInterval = 5000;

// Improved Function to set up the SSH tunnel with retry logic
export async function setupSshTunnel(retries = 0) {
  try {
    const [server, sshConnection] = await createTunnel.createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
    console.log('SSH Tunnel established successfully');
    return { server, sshConnection };
  } catch (error) {
    console.error('Failed to establish SSH Tunnel:', error);
    if (retries < maxRetries) {
      console.log(`Attempting to re-establish SSH Tunnel... Retry: ${retries + 1}`);
      setTimeout(() => setupSshTunnel(retries + 1), reconnectInterval);
    } else {
      console.error('Max retries reached. Giving up on establishing SSH Tunnel.');
      throw new Error('Max retries reached for SSH Tunnel setup.');
    }
  }
}

const forwardOptions_MGR = {
  srcAddr: "127.0.0.1",
  srcPort: 3334,
  dstAddr: "127.0.0.1",
  dstPort: 3306,
};

const serverOptions_MGR = {
  port: 3334, // Local port to listen on for the tunnel
  host: "127.0.0.1",
};

// Repeating the similar logic for EIMS3_MGR
export async function setupSshTunnel_MGR(retries = 0) {
  try {
    const [server, sshConnection] = await createTunnel.createTunnel(tunnelOptions, serverOptions_MGR, sshOptions, forwardOptions_MGR);
    console.log('SSH Tunnel MGR established successfully');
    return { server, sshConnection };
  } catch (error) {
    console.error('Failed to establish SSH Tunnel MGR:', error);
    if (retries < maxRetries) {
      console.log(`Attempting to re-establish SSH Tunnel MGR... Retry: ${retries + 1}`);
      setTimeout(() => setupSshTunnel_MGR(retries + 1), reconnectInterval);
    } else {
      console.error('Max retries reached. Giving up on establishing SSH Tunnel MGR.');
      throw new Error('Max retries reached for SSH Tunnel MGR setup.');
    }
  }
}
