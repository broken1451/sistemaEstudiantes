import { IsString, MinLength, IsNotEmpty, IsEmail, MaxLength, Matches, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateMateriaDto {

    @ApiProperty()
    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    nombre_materia: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    docente?: string;
}
