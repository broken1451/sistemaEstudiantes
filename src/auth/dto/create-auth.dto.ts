import { IsString, MinLength, IsNotEmpty, IsEmail, MaxLength, Matches, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthDto {

    @ApiProperty()
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    name: string;


    @ApiProperty()
    @IsString()
    @IsEmail()
    @IsOptional()
    email: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    img: string

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

    @ApiProperty()
    @IsString({ each: true }) // cada uno de los elementos  del arreglo  tiene q ser string
    @IsArray()
    @IsOptional()
    roles?: string[];


}
