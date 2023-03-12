import { IsString, MinLength, IsNotEmpty, IsEmail, MaxLength, Matches, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocenteDto {

    @ApiProperty()
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    nro_identidad: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    name_teacher: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    @IsOptional()
    lastname_teacher: string;

    @ApiProperty()
    @IsString({ each: true }) // cada uno de los elementos  del arreglo  tiene q ser string
    @IsArray()
    @IsNotEmpty()
    speciality_teacher: string[];

    @ApiProperty()
    @IsString()
    @IsOptional()
    img: string
}
