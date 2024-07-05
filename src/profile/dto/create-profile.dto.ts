import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsMimeType } from '../decorator/file.decorator';
export class CreateProfileDto {
    @IsNotEmpty()
    @IsMimeType(['image/jpeg', 'image/png']) 
    image: string;

    @IsNotEmpty()
    @IsEmail()
    displayName: string;

    @IsNotEmpty()
    @IsString()
    @IsIn(['male', 'female'])
    gender: string;

    @IsNotEmpty()
    birthday: Date;

    @IsNotEmpty()
    @IsNumber()
    height: number;

    @IsNotEmpty()
    @IsNumber()
    weight: number;
}
