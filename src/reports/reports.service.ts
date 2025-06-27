import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrinterService } from 'src/printer/printer.service';
import { getFactura } from 'src/reportes-bases';
import { DataSource } from 'typeorm';


import { getValorizado } from 'src/reportes-bases/valorizado';
import { getKardexProducto } from 'src/reportes-bases/kardex';

@Injectable()
export class ReportsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly printerService: PrinterService
  ) {

  }
  async factura(codigo_sucursal:number,serie: string, numero: number) {
    const producto= await this.dataSource.query(`select * 
            from VFEL_FACTURAS_ENC_DET 
            where   CODIGO_SUCURSAL = @0 
            And     NUMERO_FACTURA  = @1
            And     SERIE           = @2`,[
              codigo_sucursal,
              numero,
              serie
            ])


    if( !producto || producto.length===0 ){
      throw new NotFoundException(`No existe la factura con serie: ${serie} - y numero: ${numero}`)
    }

    const docDefinition = getFactura({title:'Reporte',description:'Esto es una prueba', detallesFactura: producto})
  // const docDefinition: TDocumentDefinitions ={
  //   content: [
  //     'First paragraph',
  //     'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
  //   ]
  // }

  
    const doc = this.printerService.createPdf(docDefinition) 
    return doc
  }

  async getKardex( bodega: number, producto: string ) {
    const kardex= await this.dataSource.query(`select * 
            from KARDEX_PRODUCTOS
            where CODIGO_BODEGA=${bodega} 
            and  PRODUCT0='${producto}'
            `)

    if( !kardex || kardex.length===0 ){
      throw new NotFoundException(`No se encontró movimientos para el producto`)
    }

    const docDefinition = getKardexProducto({ title:'REPORTE DE KARDEX', description:kardex[0].DESCRIPCION_CORTA, kardexProducto:kardex })

    const doc = this.printerService.createPdf(docDefinition) 
    return doc
  }
  async valorizado( bodega: number ) {
    const valor= await this.dataSource.query(`SELECT * FROM VALORIZADO_BODEGAS
            where CODIGO_BODEGA=${bodega}`)

    if( !valor || valor.length===0 ){
      throw new NotFoundException(`No se encontró movimientos para el producto`)
    }

    const docDefinition = getValorizado({description: '' ,title:'VALORIZADO',valorizadoDet:valor})

    const doc = this.printerService.createPdf(docDefinition) 
    return doc
  }

}
