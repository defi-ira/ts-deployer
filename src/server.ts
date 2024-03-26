import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import ganache, { Server } from '@ganache/cli';
import http from 'http';
import Chain from './models/Chain';
import { address_from_pk, getInitialAccounts } from './util/AccountUtil';

import Web3 from 'web3';

const contractABI: any[] = [
    {
      "inputs": [],
      "name": "getNumber",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function",
      "constant": true
    }
  ];
const contractBytecode: string = '0x608060405234801561001057600080fd5b5060b68061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c8063f2c9ecd814602d575b600080fd5b60336047565b604051603e91906067565b60405180910390f35b6000602a905090565b6000819050919050565b6061816050565b82525050565b6000602082019050607a6000830184605a565b9291505056fea2646970667358221220cc44b0c2c479c888ed4f6c003b0eb538c046c48349f2095906c3a02da8f6937764736f6c634300080d0033';

const app = express();
const port = 3000;

export function run_chain_interface(chain: Chain) {
    const server = chain.server;
    const accounts = getInitialAccounts(chain);

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

    // API for default JSON-RPC transactions
    app.post('/', (req: Request, res: Response) => {
        if (server == null || chain == null) {
            res.send({"error": "chain or server not present"});
            return;
        } else {
            const jsonRpcRequest = req.body;
            (server as Server).provider.send(jsonRpcRequest.method, jsonRpcRequest.params)
                .then((result: any) => {
                    console.log('JSON-RPC Transaction:', result);
                    res.send(result);
                })
                .catch((error: any) => {
                    console.error('Failed to process JSON-RPC transaction:', error);
                    res.status(500).send('Failed to process JSON-RPC transaction');
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

    app.post('/deploy', async (req, res) => {
        try {
            const web3 = new Web3(server.provider);
            const accounts = await web3.eth.getAccounts();
    
            // Create a new contract instance
            const contract = new web3.eth.Contract(contractABI);
    
            // Deploy the contract
            const deployedContract = await contract.deploy({
                data: contractBytecode,
                arguments: [] // Any constructor arguments here
            }).send({
                from: accounts[0], // Use the first account as the sender
                gas: '4700000' // Set a gas limit for the deployment transaction
            });
    
            res.send({
                message: "Contract deployed successfully!",
                contractAddress: deployedContract.options.address
            });
        } catch (error) {
            console.error("Failed to deploy contract:", error);
            res.status(500).send({error: "Failed to deploy contract"});
        }
    });

    // Start express server
    app.listen(port, () => {
        console.log(`chain interface server at http://localhost:${port} >>>>>>`);
    });





}


