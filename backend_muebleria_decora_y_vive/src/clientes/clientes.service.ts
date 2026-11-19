import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Cliente } from "./entities/cliente.entity";
import { Usuario } from "../usuarios/entities/usuario.entity";
import { CreateClienteDto } from "./dto/create-cliente.dto";
import { UpdateClienteDto } from "./dto/update-cliente.dto";

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // Registrar un cliente
  async create(createClienteDto: CreateClienteDto) {
    const clienteExistente = await this.clienteRepository.findOneBy({
      ci: createClienteDto.ci,
    });

    if (clienteExistente) {
      throw new ConflictException("El CI ya esta registrado");
    }

    const cliente = this.clienteRepository.create(createClienteDto);

    return await this.clienteRepository.save(cliente);
  }

  // Listar clientes presenciales y virtuales
  async findAll() {
    const clientesPresenciales = await this.clienteRepository.find();

    const clientesVirtuales = await this.usuarioRepository.find({
      where: { rol: "CLIENTE" },
      select: {
        id_usuario: true,
        nombres: true,
        apellidos: true,
        ci: true,
        telefono: true,
        nombre_completo: true,
        correo: true,
        estado: true,
        fecha_registro: true,
      },
    });

    const presenciales = clientesPresenciales.map((cliente) => ({
      ...cliente,
      origen: "PRESENCIAL",
    }));

    const virtuales = clientesVirtuales.map((usuario) => ({
      id_cliente: null,
      id_usuario: usuario.id_usuario,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      ci: usuario.ci,
      telefono: usuario.telefono,
      correo: usuario.correo,
      direccion: null,
      estado: usuario.estado,
      fecha_registro: usuario.fecha_registro,
      origen: "VIRTUAL",
    }));

    return [...presenciales, ...virtuales];
  }

  // Buscar un cliente por ID
  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOneBy({
      id_cliente: id,
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }

    return cliente;
  }

  // Actualizar un cliente
  async update(id: number, updateClienteDto: UpdateClienteDto) {
    const cliente = await this.findOne(id);

    if (updateClienteDto.ci && updateClienteDto.ci !== cliente.ci) {
      const clienteExistente = await this.clienteRepository.findOneBy({
        ci: updateClienteDto.ci,
      });

      if (clienteExistente) {
        throw new ConflictException("El CI ya esta registrado");
      }
    }

    Object.assign(cliente, updateClienteDto);

    return await this.clienteRepository.save(cliente);
  }

  // Eliminar un cliente
  async remove(id: number) {
    const cliente = await this.findOne(id);

    await this.clienteRepository.remove(cliente);

    return {
      mensaje: "Cliente eliminado correctamente",
    };
  }
}
