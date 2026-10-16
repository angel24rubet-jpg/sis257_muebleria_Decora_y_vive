# MUEBLERÍA “DECORA & VIVE”

## Descripción del Proyecto
El presente proyecto consiste en el desarrollo de un sistema web para la gestión y venta de muebles, diseñado para facilitar tanto la administración de los productos de una tienda como el proceso de compra por parte de los clientes.

El sistema permitirá que el administrador pueda gestionar los muebles disponibles, sus categorías, precios y cantidades en stock. Por otro lado, los clientes podrán registrarse, consultar el catálogo de productos, agregar muebles a un carrito de compras y realizar pedidos mediante la plataforma.

El objetivo principal es desarrollar una aplicación web funcional que integre frontend, backend y base de datos, permitiendo gestionar de manera organizada las operaciones principales de una tienda de muebles.

## Objetivos

### Objetivo General
Desarrollar un sistema web de comercio electrónico para una tienda de muebles que permita administrar productos y gestionar las compras de los clientes mediante una plataforma web.

### Objetivos Específicos
- Implementar un sistema de registro e inicio de sesión de usuarios.
- Permitir la gestión de muebles por parte del administrador.
- Organizar los muebles mediante categorías.
- Controlar el precio y stock disponible de cada producto.
- Mostrar un catálogo de muebles para los clientes.
- Implementar un carrito de compras.
- Permitir a los clientes realizar pedidos.
- Implementar una base de datos para almacenar y relacionar la información del sistema.

## Tipos de Usuarios

El sistema contará inicialmente con dos tipos de usuarios:

**1. Administrador**
Tendrá acceso a las funciones de gestión del sistema:
- Iniciar sesión.
- Registrar, modificar y eliminar muebles.
- Gestionar categorías.
- Actualizar precios y cantidades disponibles.

**2. Cliente**
Podrá realizar las siguientes acciones:
- Iniciar sesión y registrarse en el sistema.
- Consultar el catálogo de muebles y buscar productos.
- Ver información detallada del mueble.
- Agregar productos a su compra y realizar pedidos.

## Tecnologías Usadas
Para el desarrollo del sistema web "Decora y Vive", se aplicarán las convenciones, buenas prácticas y herramientas establecidas para la materia SIS257:

- **Base de Datos:** PostgreSQL (Nombre de la BD: `sis257_decora_y_vive`).
- **Backend:** NestJS (Framework Node.js) y JWT (JSON Web Tokens para autenticación).
- **Frontend:** Vue.js, Axios (cliente HTTP) y Bootstrap (diseño responsivo).
- **Herramientas:** Git/GitHub para control de versiones y DBeaver para gestión de BD y diagramas ER.

## Estructura del Repositorio
- `/backend_decora_y_vive`: Contiene la API REST desarrollada en NestJS.
- `/frontend_decora_y_vive`: Contiene la interfaz de usuario desarrollada en Vue.js.
- `/docs`: Contiene documentación adicional y diagramas (ej. Diagrama ER).

---

## Entidades Tentativas de la Base de Datos

A continuación, se presentan las tablas iniciales estructuradas relacionalmente para el funcionamiento del sistema:

### Tabla: `usuarios`

| Columna          | Tipo de Dato (PostgreSQL) | Restricciones               | Descripción                            |
| :--------------- | :------------------------ | :-------------------------- | :------------------------------------- |
| `id`             | SERIAL                    | PRIMARY KEY                 | Identificador único autoincremental.   |
| `nombre`         | VARCHAR(100)              | NOT NULL                    | Nombre completo del usuario.           |
| `email`          | VARCHAR(150)              | NOT NULL, UNIQUE            | Correo electrónico de acceso.          |
| `password`       | VARCHAR(255)              | NOT NULL                    | Contraseña encriptada (Hash).          |
| `rol`            | VARCHAR(20)               | NOT NULL, DEFAULT 'CLIENTE' | Define permisos (`ADMIN` o `CLIENTE`). |
| `fecha_registro` | TIMESTAMP                 | DEFAULT CURRENT_TIMESTAMP   | Fecha y hora exacta de creación.       |

### Tabla: `categorias`

| Columna       | Tipo de Dato (PostgreSQL) | Restricciones    | Descripción                         |
| :------------ | :------------------------ | :--------------- | :---------------------------------- |
| `id`          | SERIAL                    | PRIMARY KEY      | Identificador único autoincremental.|
| `nombre`      | VARCHAR(50)               | NOT NULL, UNIQUE | Nombre de la categoría (ej. Salas). |
| `descripcion` | TEXT                      | NULL             | Descripción opcional detallada.     |

### Tabla: `muebles`

| Columna        | Tipo de Dato (PostgreSQL) | Restricciones                 | Descripción                          |
| :------------- | :------------------------ | :---------------------------- | :----------------------------------- |
| `id`           | SERIAL                    | PRIMARY KEY                   | Identificador único autoincremental. |
| `id_categoria` | INT                       | NOT NULL, FOREIGN KEY         | FK hacia la tabla `categorias`.      |
| `nombre`       | VARCHAR(100)              | NOT NULL                      | Nombre comercial del mueble.         |
| `descripcion`  | TEXT                      | NOT NULL                      | Especificaciones y dimensiones.      |
| `precio`       | DECIMAL(10,2)             | NOT NULL, CHECK (precio >= 0) | Precio monetario del producto.       |
| `stock`        | INT                       | NOT NULL, DEFAULT 0           | Cantidad de unidades en almacén.     |
| `imagen_url`   | VARCHAR(255)              | NULL                          | Ruta de la fotografía principal.     |

### Tabla: `pedidos` (Cabecera de la transacción)

| Columna        | Tipo de Dato (PostgreSQL) | Restricciones                 | Descripción                               |
| :------------- | :------------------------ | :---------------------------- | :---------------------------------------- |
| `id`           | SERIAL                    | PRIMARY KEY                   | Identificador único del recibo.           |
| `id_usuario`   | INT                       | NOT NULL, FOREIGN KEY         | FK hacia la tabla `usuarios`.             |
| `fecha_pedido` | TIMESTAMP                 | DEFAULT CURRENT_TIMESTAMP     | Fecha de la confirmación.                 |
| `estado`       | VARCHAR(20)               | NOT NULL, DEFAULT 'PENDIENTE' | Estado: `PENDIENTE`, `PAGADO`, `ENVIADO`. |
| `total`        | DECIMAL(10,2)             | NOT NULL, DEFAULT 0.00        | Sumatoria total monetaria.                |

### Tabla: `detalle_pedidos` (Cuerpo de la transacción)

| Columna           | Tipo de Dato (PostgreSQL) | Restricciones                  | Descripción                                  |
| :---------------- | :------------------------ | :----------------------------- | :------------------------------------------- |
| `id`              | SERIAL                    | PRIMARY KEY                    | Identificador único de la línea.             |
| `id_pedido`       | INT                       | NOT NULL, FOREIGN KEY          | FK hacia la cabecera `pedidos`.              |
| `id_mueble`       | INT                       | NOT NULL, FOREIGN KEY          | FK hacia el producto `muebles`.              |
| `cantidad`        | INT                       | NOT NULL, CHECK (cantidad > 0) | Unidades adquiridas de este mueble.          |
| `precio_unitario` | DECIMAL(10,2)             | NOT NULL                       | Precio fijado al momento de compra.          |
| `subtotal`        | DECIMAL(10,2)             | NOT NULL                       | Resultado de `cantidad` * `precio_unitario`. |


