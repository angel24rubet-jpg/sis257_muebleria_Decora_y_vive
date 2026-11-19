import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateUsuarioDto {
  // Nombres
  @IsString()
  @IsNotEmpty({ message: "Los nombres son obligatorios" })
  @MaxLength(100)
  nombres: string;

  // Apellidos
  @IsString()
  @IsNotEmpty({ message: "Los apellidos son obligatorios" })
  @MaxLength(100)
  apellidos: string;

  // Carnet de identidad
  @IsString()
  @IsNotEmpty({ message: "El CI es obligatorio" })
  @MaxLength(20)
  ci: string;

  // Numero de telefono
  @IsString()
  @IsNotEmpty({ message: "El telefono es obligatorio" })
  @MaxLength(20)
  telefono: string;

  // Nombre completo
  @IsString()
  @IsNotEmpty({ message: "El nombre completo es obligatorio" })
  @MaxLength(150)
  nombre_completo: string;

  // Nombre de usuario
  @IsString()
  @IsNotEmpty({ message: "El usuario es obligatorio" })
  @MaxLength(50)
  usuario: string;

  // Correo electronico
  @IsEmail({}, { message: "El correo no es valido" })
  @IsNotEmpty({ message: "El correo es obligatorio" })
  @MaxLength(120)
  correo: string;

  // Contrasena
  @IsString()
  @IsNotEmpty({ message: "La contrasena es obligatoria" })
  @MinLength(8, {
    message: "La contrasena debe tener al menos 8 caracteres",
  })
  password: string;
}
