import { Module } from "@nestjs/common";
import { createObserveModule } from "@nestjs/observe";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriasModule } from "./categorias/categorias.module";
import { ProductosModule } from "./productos/productos.module";
import { ColoresModule } from "./colores/colores.module";

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT ?? "5432", 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),

    CategoriasModule,
    ProductosModule,
    ColoresModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}