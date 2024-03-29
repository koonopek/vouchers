import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { decodeUnsignedTransaction, generateAccount, mnemonicToSecretKey, signTransaction } from "algosdk";
import { ContractService } from "../src/contract/contract.service";
import { AppModule } from "../src/app.module";
import { ParticipationService } from "../src/participation/participation.service";
import { AsaService } from "../src/asa/asa.service";
import { UserService } from "../src/user/user.service";
import { WalletService } from "../src/wallet/wallet.service";
import { randomString } from "./create_asa";


const decodeTx = (tx) => decodeUnsignedTransaction(Uint8Array.from(tx));

export async function distribute(app: INestApplication, entityAsaID: number, memo: string) {

    const userService = app.get(UserService);
    const tokenService = app.get(ParticipationService);
    const walletService = app.get(WalletService);

    const user = await userService.create({ email: `email${randomString()}@com.pl`, password: "password" });
    const userWallet = await generateAccount();
    const addr = userWallet.addr;
    const sk = userWallet.sk;

    const token = tokenService.generateToken(user.id!, entityAsaID.toString());

    await walletService.addWallet({
        asaID: entityAsaID,
        encryptedPrivateKey: "qwe",
        metadata: {
            iterations: 0,
            nonce: ""
        },
        publicKey: userWallet.addr,
        userID: user.id
    })

    const supplierAccount = mnemonicToSecretKey(memo);
    const distributeService = app.get(ParticipationService);
    const contractService = app.get(ContractService);
    const asaService = app.get(AsaService);


    const optInContractTx = await contractService.createOptInContractTx({ address: addr, entityAsaID: entityAsaID });
    const sOptInContractTx = signTransaction(optInContractTx, sk);

    const optInAsaTx = await asaService.makeOptInTx({ address: addr, entityAsaID: entityAsaID });
    const sOptInAsaTx = signTransaction(optInAsaTx, sk);

    await Promise.all([
        contractService.sendOptInTx(sOptInAsaTx),
        contractService.sendOptInTx(sOptInContractTx),
    ])

    const toSign = await distributeService.makeParticipateTxByToken({ encodedToken: token, from: supplierAccount.addr, amount: 100 });

    await distributeService.sendParticipateTx({
        asaTransferTx: decodeUnsignedTransaction(Uint8Array.from(toSign.asaTransferTx)),
        checkLevelSigTx: signTransaction(decodeTx(toSign.checkLevelTx), supplierAccount.sk),
        paymentSigTx: signTransaction(decodeTx(toSign.paymentTx), supplierAccount.sk),
        setLevelSigTx: signTransaction(decodeTx(toSign.userSetLevelTx), supplierAccount.sk),
    });

    return { userWallet, supplierAccount, user };
}

export async function createApp() {
    const app = await NestFactory.create(AppModule);

    await app.init();

    return app;
}

