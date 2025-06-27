import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsModule } from './reports/reports.module';
import { PrinterModule } from './printer/printer.module';


@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'myazuresema.database.windows.net',
      port: 1433, 
      username:'devDB',
      password: 'coderDev2025',
      database: 'LIBREARIA_DEV',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      extra: {
        encrypt: true,
        trustServerCertificate: false,
        ssl: process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null,
      }
    }),

    ReportsModule,

    PrinterModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
