import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService
  ) {}

  @Get('factura')
  async facturasTickets(
    @Res() response: Response,
    @Query('serie') serie: string,
    @Query('numero') numero: number
  ) {
     console.log(` serie: ${serie} y num factura: ${numero} `);
    const pdfDoc = await this.reportsService.factura( serie,+numero);

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title='Comprobante de compra';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Get('kardex')
  async kardex(
    @Res() response: Response,
  ) {
    const pdfDoc = await this.reportsService.getKardex(1, '10001')

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title='Kardex de producto';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
  @Get('valorizado')
  async valorizado(
    @Res() response: Response,
    @Param('bodega') bodega: number
  ) {
    const pdfDoc = await this.reportsService.valorizado(bodega)

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title='Valorizado por bodega';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }


}
