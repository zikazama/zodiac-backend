import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IsEqualTo } from '../decorator/is-equal-to.decorator';
export class RegisterDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @IsEqualTo('password', {
        message: 'passwordConfirm must match password',
    })
    password: string;

    @IsNotEmpty()
    @IsString()
    @IsEqualTo('password', {
        message: 'passwordConfirm must match password',
    })
    passwordConfirm: string;
}
