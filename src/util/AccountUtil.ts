import { Server } from "@ganache/cli";
import Chain from "../models/Chain";
import * as ethUtil from 'ethereumjs-util';

export function getInitialAccounts(chain: Chain) {
    const initial_accounts = chain.server.provider.getInitialAccounts();
    const initial_accounts_array = Object.values(initial_accounts);

    const final_accounts_array: any[] = [];
    initial_accounts_array.forEach((account) => {
        final_accounts_array.push({
            pk: account.secretKey,
            balance: account.balance.toString()
        })
    });

    return final_accounts_array;
}

export function address_from_pk(pk: string): string {
    console.log(pk.trim());

    const privateKeyBytes = Uint8Array.from(Buffer.from(pk.replace('0x', ''), 'hex'));

    console.log(privateKeyBytes);

    const publicKey = ethUtil.privateToPublic(Buffer.from(privateKeyBytes));
    const address = ethUtil.publicToAddress(publicKey).toString('hex');
    return "0x" + address;
}

export function build_sample_tx_params(accounts: any[]): any {
    const transaction_request: any = {};
    transaction_request.from = address_from_pk(accounts[0].pk);
    transaction_request.to = address_from_pk(accounts[1].pk);
    transaction_request.value = '0xDE0B6B3A7640000';
    transaction_request.gas = '0x76c0';
    transaction_request.gas_price = '0x9184e72a000';
    return transaction_request;
}

export function send_ethTransaction(server: any, transaction_request: any): Promise<any> {
    return (server as Server).provider.send('eth_sendTransaction', [transaction_request]);
}