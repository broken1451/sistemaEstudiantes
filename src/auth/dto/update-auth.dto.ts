import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {

    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    updated: number;
}
