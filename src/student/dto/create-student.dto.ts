import { IsString, MinLength, IsNotEmpty, IsEmail, MaxLength, Matches, IsOptional, IsArray, IsDate, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateStudentDto {

    @ApiProperty()
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    nro_identidad: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    name_student: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    @IsOptional()
    lastname_student: string;

    @IsDate({ message: "f_nacimiento debe ser una fecha valida" })
    @Type(() => Date)
    @IsNotEmpty({ message: "f_nacimiento es requerido" })
    f_nacimiento: Date;
    
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @IsOptional()
    sexo: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    @IsOptional()
    jornada: string;

    @ApiProperty()
    @IsString()
    @MinLength(1)
    @IsOptional()
    direccion: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    telefono: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    img: string
}
