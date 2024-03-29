import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlgorandModule } from "../algorand/algorand.module";
import Wallet from "../wallet/wallet.entity";
import { UserController } from "./user.controller";
import User from "./user.entity";
import { UserService } from "./user.service";

@Module({
    imports: [TypeOrmModule.forFeature([User, Wallet]), AlgorandModule],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule { }