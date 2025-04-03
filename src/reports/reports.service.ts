import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import type { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrinterService } from 'src/printer/printer.service';
import { getFactura } from 'src/reportes-bases';
import { DataSource } from 'typeorm';




@Injectable()
export class ReportsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly printerService: PrinterService
  ) {

  }
  async factura(serie: string, numero: number) {
    const facturas= await this.dataSource.query(`select * 
            from VFEL_FACTURAS_ENC_DET 
            where SERIE='${serie}' 
            and NUMERO_FACTURA=${numero}`)

    if( !facturas || facturas.length===0 ){
      throw new NotFoundException(`No existe la factura con serie: ${serie} - y numero: ${numero}`)
    }

    const docDefinition = getFactura({title:'Reporte',description:'Esto es una prueba', detallesFactura: facturas})
  // const docDefinition: TDocumentDefinitions ={
  //   content: [
  //     'First paragraph',
  //     'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
  //   ]
  // }

  
    const doc = this.printerService.createPdf(docDefinition) 
    return doc
  }

}
