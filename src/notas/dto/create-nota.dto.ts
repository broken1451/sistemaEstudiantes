import { IsString, MinLength, IsNotEmpty, IsEmail, MaxLength, Matches, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotaDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    note: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    student?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    materia?: string;

}
