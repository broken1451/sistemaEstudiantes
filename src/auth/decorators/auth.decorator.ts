import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GuardAuth } from '../guard/guard.guard';
import { ValidRoles } from '../interfaces/role.interface';
import { Roles } from './decorators.decorator';

export function Auth(...roles: ValidRoles[]) {
    return applyDecorators(
        Roles(...roles),
        UseGuards(AuthGuard('jwt'), GuardAuth)
    );
}