# MUEBLERIA “DECORA & VIVE”

DESCRIPCION DEL PROYEXTO DE DESARROLLO DEL SISTEMA 
El presente proyecto consiste en el desarrollo de un sistema web para la gestión y venta de muebles, diseñado para facilitar tanto la administración de los productos de una tienda como el proceso de compra por parte de los clientes.
El sistema permitirá que el administrador pueda gestionar los muebles disponibles, sus categorías, precios y cantidades en stock. Por otro lado, los clientes podrán registrarse, consultar el catálogo de productos, agregar muebles a un carrito de compras y realizar pedidos mediante la plataforma.
El objetivo principal es desarrollar una aplicación web funcional que integre frontend, backend y base de datos, permitiendo gestionar de manera organizada las operaciones principales de una tienda de muebles.

OBJETIVO GENERAL
Desarrollar un sistema web de comercio electrónico para una tienda de muebles que permita administrar productos y gestionar las compras de los clientes mediante una plataforma web.

OBJETIVOS ESPECIFICOS
	Implementar un sistema de registro e inicio de sesión de usuarios.
	Permitir la gestión de muebles por parte del administrador.
	Organizar los muebles mediante categorías.
	Controlar el precio y stock disponible de cada producto.
	Mostrar un catálogo de muebles para los clientes.
	Implementar un carrito de compras.
	Permitir a los clientes realizar pedidos.
	Implementar una base de datos para almacenar y relacionar la información del sistema.

TIPOS DE USUARIOS

El sistema contará inicialmente con dos tipos de usuarios:

ADMINISTRADOR 
El administrador tendrá acceso a las funciones de gestión del sistema:
•	Iniciar sesión.
•	Registrar muebles.
•	Modificar muebles.
•	Eliminar muebles.
•	Gestionar categorías.
•	Actualizar precios.
•	Actualizar cantidades disponibles.
CLIENTE
El cliente podrá:
•	Iniciar sesión.
•	Registrarse en el sistema.
•	Consultar el catálogo de muebles.
•	Buscar productos.
•	Ver información del mueble.
•	Agregar productos a su compra.
•	Realizar pedidos.

TECNOLOGIAS USADAS

Para el desarrollo del sistema web "Decora y Vive", se aplicarán las convenciones, buenas prácticas y herramientas establecidas para el proyecto de la materia (SIS257), estructurando el sistema de la siguiente manera:

Base de Datos:

PostgreSQL: Sistema de gestión de base de datos relacional (Nombre de la BD: `sis257_decora_y_vive`).
Backend:
	NestJS: Framework de Node.js para construir la API REST eficiente y escalable.
	JWT (JSON Web Tokens): Para la gestión de autenticación, autorización y protección de rutas (Login).

Frontend:

	Vue.js: Framework progresivo de JavaScript para construir la interfaz de usuario.
	Axios: Cliente HTTP para la comunicación con el Backend (consumo de la API).
	Bootstrap (Template): Para el diseño responsivo y la maquetación de la plataforma web.

Herramientas de Desarrollo y Gestión:

	Git y GitHub: Para el control de versiones y trabajo colaborativo.
	DBeaver: Para la gestión de la base de datos y generación del Diagrama Entidad-Relación (ER). 

A continuación, se presentan algunas de las tablas que se consideran necesarias para el funcionamiento del sistema. Estas tablas son tentativas y podrán modificarse y complementarse durante el desarrollo del proyecto según las necesidades del sistema.

TABLA USUARIO
id
nombre
email
password
rol
fecha_registro

TABLA MUEBLES

Id
Nombre
Descripción
Precio
Stock
Imagen

TABLA PEDIDO

Id
Id_mueble
Fecha_pedido
Precio_total

Id
Nombre
Email
Password
Rol
Fecha_registro

