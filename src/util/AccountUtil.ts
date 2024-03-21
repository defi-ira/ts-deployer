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