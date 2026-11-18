
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'El usuario o correo es obligatorio' })
  usuario: string;

  @IsString()
  @IsNotEmpty({ message: 'La contrasena es obligatoria' })
  password: string;
}
