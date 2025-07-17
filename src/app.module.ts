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
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || '1433'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
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
export class AppModule { }
