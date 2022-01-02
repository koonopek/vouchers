import { IsString, Length } from "class-validator";
import { SignedTx } from "src/algorand/algosdk.types";
import { Transform } from "class-transformer";
import { jsonEncodedUint8ArrayToUint8Array } from "src/lib/Helpers";

export default class SignedTxDto implements SignedTx {
    @IsString()
    @Length(52, 52)
    txID: string;

    @Transform(jsonEncodedUint8ArrayToUint8Array)
    blob: Uint8Array;
}

