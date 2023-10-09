import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateDocenteDto } from './create-docente.dto';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDocenteDto extends PartialType(CreateDocenteDto) {


    @ApiProperty()
    @IsOptional()
    @Type(() => Number)
    updated: number;
}
