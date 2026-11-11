import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  MinLength,
  IsIn,
} from 'class-validator';

export class CreateUsuarioDto {
  // Nombre completo
  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @MaxLength(150)
  nombre_completo: string;

  // Nombre de usuario
  @IsString()
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @MaxLength(50)
  usuario: string;

  // Correo electronico
  @IsEmail({}, { message: 'El correo no es valido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @MaxLength(120)
  correo: string;

  // Contrasena
  @IsString()
  @IsNotEmpty({ message: 'La contrasena es obligatoria' })
  @MinLength(8, {
    message: 'La contrasena debe tener al menos 8 caracteres',
  })
  password: string;

  // Rol del usuario
  @IsString()
  @IsNotEmpty()
  @IsIn(['ADMINISTRADOR', 'VENDEDOR'], {
    message: 'El rol seleccionado no es valido',
  })
  rol: string;
}
