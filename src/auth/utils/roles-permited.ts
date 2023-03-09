import { BadRequestException } from "@nestjs/common";

export const rolesPermited = (rolesReq: string[], rolesPermited: string[]) => {
    for (const rol of rolesReq) {
        if (!rolesPermited.includes(rol)) {
          throw new BadRequestException(
            `El rol ingresado no es permitido, roles permitidos [${rolesPermited}]`,
          );
        }
      }
}