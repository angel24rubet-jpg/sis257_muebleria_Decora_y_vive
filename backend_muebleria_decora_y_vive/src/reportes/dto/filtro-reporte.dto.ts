import {
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class FiltroReporteDto {
  // Fecha inicial en formato dia/mes/anio
  @IsNotEmpty({ message: 'La fecha inicial es obligatoria' })
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'La fecha inicial debe tener formato DD/MM/YYYY',
  })
  fecha_inicio: string;

  // Fecha final en formato dia/mes/anio
  @IsNotEmpty({ message: 'La fecha final es obligatoria' })
  @Matches(/^\d{2}\/\d{2}\/\d{4}$/, {
    message: 'La fecha final debe tener formato DD/MM/YYYY',
  })
  fecha_fin: string;
}
