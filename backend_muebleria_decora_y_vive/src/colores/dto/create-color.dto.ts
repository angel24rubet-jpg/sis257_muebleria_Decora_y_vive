import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateColorDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del color es obligatorio' })
  @MaxLength(50)
  nombre: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'El codigo debe tener el formato hexadecimal #RRGGBB',
  })
  codigo_hex?: string;
}