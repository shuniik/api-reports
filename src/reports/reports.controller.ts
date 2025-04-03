import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';

import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService
  ) {}

  @Get('factura/:serie/:numero')
  async facturaTickets(
    @Res() response: Response,
    @Param('serie') serie: string,
    @Param('numero') numero: string
  ) {
    
    // console.log(` serie: ${serie} y num factura: ${numero} `);
    const pdfDoc = await this.reportsService.factura( serie,+numero);

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title='Comprobante de compra';
    pdfDoc.pipe(response);
    pdfDoc.end();
  }


}
