import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CreateDocenteDto } from 'src/docente/dto/create-docente.dto';

@Injectable()
export class RutPipePostDocente implements PipeTransform {
  transform(value: CreateDocenteDto, metadata: ArgumentMetadata) {

    if (value.nro_identidad.match(/(?!0{7,8})(?!1{7,8})(?!2{7,8})(?!3{7,8})(?!4{7,8})(?!5{7,8})(?!6{7,8})(?!7{7,8})(?!8{7,8})(?!9{7,8})[0-9]{7,8}-[0-9kK]{1}/g)) {
      let splittedRut = value.nro_identidad.split('-', 2);
      if (splittedRut.length > 1) {
        let rootNumber = splittedRut[0];
        let toBeChecked = splittedRut[1].toLowerCase();
        let total = 0;
        let factor = 2;
        let lenRootNumber = rootNumber.length;
        for (let i = lenRootNumber - 1; i >= 0; i--) {
          if (factor > 7) {
            factor = 2;
          }
          total += +rootNumber[i] * factor;
          factor++;
        }
        let checkDigit = 11 - (total % 11);
        if (checkDigit == 11) {
          checkDigit = 0;
        }
        if (rootNumber.match(/(0){7,8}|(1){7,8}|(2){7,8}|(3){7,8}|(4){7,8}|(5){7,8}|(6){7,8}|(7){7,8}|(8){7,8}|(9){7,8}/g)) {  //handle the patrons 00.000.000-0 ... 99.999.999-9
          return false;
        }
        if ((checkDigit == 10 && toBeChecked == 'k') || "" + checkDigit == toBeChecked) {
          return value;
        } else {
          throw new BadRequestException(`El rut ingresado '${value.nro_identidad}' no contiene el formato correcto`);
        }
      } else {
        throw new BadRequestException(`El rut ingresado '${value.nro_identidad}' no contiene el formato correcto`);
      }
    } else {
      throw new BadRequestException(`El rut ingresado '${value.nro_identidad}' no contiene el formato correcto`);
    }
  }
}
