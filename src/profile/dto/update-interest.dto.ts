import { ArrayNotEmpty, ArrayUnique, IsArray, IsString } from 'class-validator';
export class UpdateInterestDto {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    keywords: string[];
}
