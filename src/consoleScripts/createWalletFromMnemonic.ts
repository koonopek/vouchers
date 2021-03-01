import { createStore } from 'key-store';
import Wallet from 'src/wallet/wallet.entity';
const algosdk = require('algosdk');

export default async function createWalletFromMnemonic(mnemonic: string, password: string) {
    const adminAccount = algosdk.mnemonicToSecretKey(mnemonic);

    const publicKey = adminAccount.addr;
    const secretKey = Buffer.from(adminAccount.sk).toString('base64');
    
    const keyStore = createStore<string,string>(() => {});
    
    await keyStore.saveKey("0",password, secretKey, publicKey);
    
    const keyPair = keyStore.getRawKeyData("0");

    const wallet = new Wallet();
    wallet.encryptedPrivateKey = keyPair.private;
    wallet.publicKey = keyPair.public;
    wallet.metadata = keyPair.metadata;

    return wallet;
}

// const wallet = await createWalletFromMnemonic("lake large patrol used layer reason side giraffe evil process mind document flag item where gauge service tragic erupt parrot unveil burden become above charge", "SecretKey")
// const userService = app.get('UserService')
// await  userService.createAdmin("admin@local.com","qazwsx123",wallet)

