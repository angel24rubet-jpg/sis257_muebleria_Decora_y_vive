import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

import { Usuario } from "./entities/usuario.entity";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Registrar cliente
  async create(createUsuarioDto: CreateUsuarioDto) {
    const existente = await this.usuarioRepository.findOne({
      where: [
        { usuario: createUsuarioDto.usuario },
        { correo: createUsuarioDto.correo },
        { ci: createUsuarioDto.ci },
      ],
    });

    if (existente) {
      throw new ConflictException(
        "El usuario o correo electronico ya se encuentra registrado",
      );
    }

    const passwordHash = await bcrypt.hash(createUsuarioDto.password, 10);

    const nuevoUsuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password: passwordHash,
      rol: "CLIENTE",
      estado: true,
    });

    const usuarioGuardado = await this.usuarioRepository.save(nuevoUsuario);

    const { password, ...resultado } = usuarioGuardado;

    return {
      mensaje: "Cliente registrado correctamente",
      usuario: resultado,
    };
  }

  // Buscar usuario para iniciar sesion
  async buscarParaLogin(usuarioOcorreo: string) {
    return this.usuarioRepository
      .createQueryBuilder("usuario")
      .addSelect("usuario.password")
      .where("usuario.usuario = :dato OR usuario.correo = :dato", {
        dato: usuarioOcorreo,
      })
      .getOne();
  }

  // Listar usuarios
  async findAll() {
    return this.usuarioRepository.find({
      select: {
        id_usuario: true,
        nombres: true,
        apellidos: true,
        ci: true,
        telefono: true,
        nombre_completo: true,
        usuario: true,
        correo: true,
        rol: true,
        estado: true,
        fecha_registro: true,
      },
      order: { id_usuario: "DESC" },
    });
  }

  // Buscar usuario por ID
  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
      select: {
        id_usuario: true,
        nombres: true,
        apellidos: true,
        ci: true,
        telefono: true,
        nombre_completo: true,
        usuario: true,
        correo: true,
        rol: true,
        estado: true,
        fecha_registro: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException("Usuario no encontrado");
    }

    return usuario;
  }

  // Modificar usuario
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException("Usuario no encontrado");
    }

    if (updateUsuarioDto.usuario || updateUsuarioDto.correo) {
      const existente = await this.usuarioRepository
        .createQueryBuilder("usuario")
        .where("(usuario.usuario = :nombre OR usuario.correo = :correo)", {
          nombre: updateUsuarioDto.usuario ?? usuario.usuario,
          correo: updateUsuarioDto.correo ?? usuario.correo,
        })
        .andWhere("usuario.id_usuario != :id", { id })
        .getOne();

      if (existente) {
        throw new ConflictException(
          "El usuario o correo ya pertenece a otra cuenta",
        );
      }
    }

    const datos = { ...updateUsuarioDto };

    // Impedir cambiar el rol desde esta operacion
    delete (datos as any).rol;

    if (datos.password) {
      datos.password = await bcrypt.hash(datos.password, 10);
    }

    Object.assign(usuario, datos);

    const actualizado = await this.usuarioRepository.save(usuario);

    const { password, ...resultado } = actualizado;

    return {
      mensaje: "Usuario actualizado correctamente",
      usuario: resultado,
    };
  }

  // Desactivar usuario
  async remove(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario: id },
    });

    if (!usuario) {
      throw new NotFoundException("Usuario no encontrado");
    }

    usuario.estado = false;
    await this.usuarioRepository.save(usuario);

    return {
      mensaje: "Usuario desactivado correctamente",
    };
  }
}
