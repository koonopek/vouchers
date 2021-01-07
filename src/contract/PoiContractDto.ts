import { IsNumber, IsString, Length } from "class-validator";

// TODO: Create default object for storing defaults values this way is 100% insecure
export default class PoiContractDto {
    
    @IsNumber()
    asaEntityID: number;

    @IsString()
    @Length(58, 58)
    from: string;
        
    @IsNumber()
    level = 1;

    // reference https://developer.algorand.org/docs/reference/teal/specification/#oncomplete
    @IsNumber()
    onComplete = 0;

    @IsNumber()
    localBytesSlices = 0;

    @IsNumber()
    globalBytesSlices = 1;

    @IsNumber()
    localInts = 1;
    
    @IsNumber()
    globalInts = 2;
    
}