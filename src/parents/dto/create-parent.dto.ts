import { IsString, MinLength, IsNotEmpty, IsEmail, MaxLength, Matches, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

export class CreateParentDto {


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    lastName?: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Type(() => Types.ObjectId)
    student?: Types.ObjectId;
}
