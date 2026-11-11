
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
} from 'class-validator';

export class CreateClienteDto {
  // Nombres del cliente
  @IsString()
  @IsNotEmpty({ message: 'Los nombres son obligatorios' })
  @MaxLength(100)
  nombres: string;

  // Apellidos del cliente
  @IsString()
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  @MaxLength(100)
  apellidos: string;

  // Carnet de identidad
  @IsString()
  @IsNotEmpty({ message: 'El CI es obligatorio' })
  @MaxLength(20)
  ci: string;

  // Numero de telefono
  @IsString()
  @IsNotEmpty({ message: 'El telefono es obligatorio' })
  @MaxLength(20)
  telefono: string;

  // Correo electronico
  @IsEmail({}, { message: 'El correo no es valido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @MaxLength(120)
  correo: string;

  // Direccion del cliente
  @IsString()
  @IsNotEmpty({ message: 'La direccion es obligatoria' })
  @MaxLength(250)
  direccion: string;
}
