import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import ganache, { Server } from '@ganache/cli';
import http from 'http';
import Chain from './models/Chain';
import { address_from_pk, getInitialAccounts } from './util/AccountUtil';

const app = express();
const port = 3000;

export function run_chain_interface(chain: Chain) {
    const server = chain.server;
    const accounts = getInitialAccounts(chain);

    console.log(accounts);

    app.use(bodyParser.json());

    // API to add a transaction
    app.post('/add_transaction', (req: Request, res: Response) => {
        if (server == null || chain == null) {
            res.send({"error": "chain or server not present"});
            return;
        } else {
            // interpolate from as the first account in the chain
            const transaction_request = req.body;

            console.log("pk1:" + address_from_pk(accounts[0].pk));
            console.log("pk2:" + address_from_pk(accounts[1].pk));
            
            transaction_request.from = address_from_pk(accounts[0].pk);
            transaction_request.to = address_from_pk(accounts[1].pk);
            transaction_request.value = '0xDE0B6B3A7640000';
            transaction_request.gas = '0x76c0';
            transaction_request.gas_price = '0x9184e72a000';

            console.log('Adding transaction:', transaction_request);

            (server as Server).provider.send('eth_sendTransaction', [transaction_request])
                .then((result: any) => {
                    console.log('Transaction added:', result);
                    res.send('Transaction added');
                })
                .catch((error: any) => {
                    console.error('Failed to add transaction:', error);
                    res.status(500).send('Failed to add transaction');
                });
        }

    });

    // API to get account history
    app.get('/initial_accounts', (req: Request, res: Response) => {
        const initial_accounts = getInitialAccounts(chain);
        res.send({ initial_accounts: initial_accounts });
    });

    // API to read a transaction from the chain
    app.get('/read_transaction/:hash', (req: Request, res: Response) => {
        const transactionHash = req.params.hash;
        if (server == null || chain == null) {
            res.send({"error": "chain or server not present"});
            return;
        } else {
            (server as Server).provider.send('eth_getTransactionByHash', [transactionHash])
                .then((result: any) => {
                    console.log('Transaction:', result);
                    res.send(result);
                })
                .catch((error: any) => {
                    console.error('Failed to read transaction:', error);
                    res.status(500).send('Failed to read transaction');
                });
        }
    });

    // API to get the ETH balance of a particular address
    app.get('/eth_balance/:address', (req: Request, res: Response) => {
        const address = req.params.address;
        if (server == null || chain == null) {
            res.send({"error": "chain or server not present"});
            return;
        } else {
            (server as Server).provider.send('eth_getBalance', [address, 'latest'])
                .then((result: any) => {
                    console.log('ETH Balance:', result);
                    res.send(result);
                })
                .catch((error: any) => {
                    console.error('Failed to get ETH balance:', error);
                    res.status(500).send('Failed to get ETH balance');
                });
        }
    });


    // API to stop the chain
    app.get('/stop_chain', (req: Request, res: Response) => {
        // export any necessary data
    });

    // API to fetch transaction history
    app.get('/chain_history', (req: Request, res: Response) => {
        // Implement fetching transaction history from the Ganache blockchain
        // Note: You might need to maintain a separate record of transactions
        // as Ganache might not provide a direct way to fetch all transaction history
        res.send('Transaction history');
    });

    // API to return memory usage metrics of the chain
    app.get('/memory_usage', (req: Request, res: Response) => {
        const memoryUsage = process.memoryUsage();
        res.json(memoryUsage);
    });

    // Start express server
    app.listen(port, () => {
        console.log(`chain interface server at http://localhost:${port} >>>>>>`);
    });

}


