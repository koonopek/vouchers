import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AlgorandModule } from "src/algorand/algorand.module";
import { AuthenticationModule } from "src/authentication/authentication.module";
import { AsaController } from "./asa.controller";
import { Asa } from "./asa.entity";
import { AsaService } from "./asa.service";

@Module({
    imports: [AlgorandModule, TypeOrmModule.forFeature([Asa]), AuthenticationModule],
    providers: [AsaService],
    controllers: [AsaController],
    exports: []
})
export class AsaModule {}