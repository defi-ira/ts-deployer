// ganacheServer.ts
import ganache from '@ganache/cli';
import process from 'process';
import Chain from './models/Chain';
import { run_chain_interface } from './server';

interface CommandLineOptions {
  port: number;
  protocols: string[];
}

function parseCommandLineArguments(): CommandLineOptions {
  const args = process.argv.slice(2); // Remove the first two default arguments
  const options: CommandLineOptions = {
    port: 8545, // Default port
    protocols: [],
  };

  args.forEach((arg, index) => {
    if (arg === '--port' && args[index + 1]) {
      options.port = parseInt(args[index + 1]);
    } else if (arg === '--protocols' && args[index + 1]) {
      options.protocols = args[index + 1].split(',');
    }
  });

  return options;
}

async function main() {
    const { port, protocols } = parseCommandLineArguments();

    // Stub for deploying protocols
    console.log(`Deploying protocols: ${protocols.join(', ')}`);

    // start the ganache server
    const server = ganache.server();

    // generate server object
    const chain = new Chain(server, port, "127.0.0.1:" + port, []);

    // run chain interface
    run_chain_interface(chain);
}

main();
