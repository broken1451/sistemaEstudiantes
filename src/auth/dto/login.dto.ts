import { IsEmail, IsString, Matches, MaxLength, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsOptional()
    email: string

    @ApiProperty()
    @IsString()
    @MinLength(1)
    @IsOptional()
    username: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    @IsOptional()
    nro_identity: string;

    @ApiProperty()
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

}