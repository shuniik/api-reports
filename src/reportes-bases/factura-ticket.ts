import { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { CurrencyFormater, DateFormater } from "src/helpers";
import { headerSections } from "./sections/header.section";
import { DetalleFactura } from "./interfaces/factura-det";
import { footerSection } from "./sections/footer.section";


interface ReportOptions {
  title: string;
  description: string;
  detallesFactura: DetalleFactura[]
}

const style: StyleDictionary = {
  header: {
    fontSize: 10,
    alignment: 'center',
    bold: true,
    margin: [0, 2, 0, 2]
  },
  subheader: {
    fontSize: 9,
    alignment: 'center',
    margin: [0, 1, 0, 1]
  },
  body: {
    fontSize: 9,
    alignment: 'justify'
  },
  footer: {
    fontSize: 9,
    italics: true,
    alignment: 'center',
    margin: [0, 20, 0, 0]
  },
  totalLabel: {
    fontSize: 9,
    bold: true
  },
  totalValue: {
    fontSize: 9,
    bold: true,
    alignment: 'right'
  },
  divider: {
    fontSize: 9,
    alignment: 'center',
    margin: [0, 5, 0, 5],
    decoration: 'underline'
  }
}

export const getFactura = ( options: ReportOptions) => {
  const { title, description,detallesFactura } = options
  const DetalleSeze = 9

  const docDefinition: TDocumentDefinitions = {
    pageSize: {
      width:277,
       height:500
      // height:'auto'
    },
    styles:style,
    header: headerSections({
      showDate: true,
      showLogo: false,
      StoreName:'TICKET ',
    }),
    // footer: footerSection,
    pageMargins:[5,70,20,30],
    
    content: [
      {

        text:'----------- DATOS DEL COMPROBANTE -----------',
        style:'header'
      },
      {
        text:`Fecha documento: ${ DateFormater.getDate( detallesFactura[0].FECHA_DE_FACTURA)}`,
        style:'header',
      },

      {
        text: `Ticket No. ${detallesFactura[0].NUMERO_FACTURA} | ${detallesFactura[0].SERIE}`,
        style: 'subheader'
      },
      {
        text: `Vendedor: ${detallesFactura[0].NOMBRE_USUARIO}`,
        style: 'subheader'
      },
      {
        text: '-----DATOS DEL COMPRADOR-----',
        style: 'subheader'
      },
      {
        text: `NIT: ${detallesFactura[0].NIT_CLIENTE_FACTURAR}`,
        style: 'subheader'
      },
      {
        text: `Nombre: ${detallesFactura[0].NOMBRE_CLIENTE_FACTURAR}`,
        style: 'subheader'
      },
      {
        text: `Dirección: ${detallesFactura[0].DIRECCION_CLIENTE_FACTURAR}`,
        style: 'subheader'
      },
      {
        text: 'DETALLE DE COMPRA',
        style: 'divider'
      },
      {
        margin: [0, 5, 0, 10],
        table: {
          headerRows: 1,
          widths: ['15%', '40%', '20%', '25%'],
          body: [
            [
              { text: 'CANT', style: 'body', bold: true, fillColor: '#f0f0f0' },
              { text: 'DESCRIPCIÓN', style: 'body', bold: true, fillColor: '#f0f0f0' },
              { text: 'PRECIO', style: 'body', bold: true, fillColor: '#f0f0f0' },
              { text: 'SUBT.', style: 'body', bold: true, fillColor: '#f0f0f0' }
            ],
            ...detallesFactura.map(detalle => [
              { text: detalle.CANTIDAD_FACTURADA, fontSize: DetalleSeze, alignment: "center" },
              { text: detalle.DESCRIPCION_LARGA, alignment: "justify", fontSize: DetalleSeze },
              { text: CurrencyFormater.format('GTQ', +detalle.PRECIO_FINAL), fontSize: DetalleSeze, alignment: "right" },
              { text: CurrencyFormater.format('GTQ', +detalle.TOTAL), fontSize: DetalleSeze, alignment: "right" }
            ])
          ]
        }
      },
      {
        
        columns:[
          { width:'*',
            text:''
          },
          { 
            width:'auto',
            layout:'noBorders',
            table:{
              body:[
               
                [
                  { text: 'Subtotal',style:'body'},
                  { text: CurrencyFormater.format('GTQ',detallesFactura[0].TOTAL_GENERAL + detallesFactura[0].TOTA_DESCUENTO),style:'body', alignment:"right"},
                ],
                [
                  { text: 'Descuento',style:'body'},
                  { text: CurrencyFormater.format('GTQ',detallesFactura[0].TOTA_DESCUENTO),style:'body', alignment:"right"},
                ],
                [
                  { text:'',style:'body', alignment:"right"},
                  { text: '_________________',style:'body'},
                ],
                [
                  { text: 'Total',style:'body', bold:true},
                  { text: CurrencyFormater.format('GTQ',detallesFactura[0].TOTAL_GENERAL),style:'body', alignment:"right", bold:true},
                ],
              ]
            }
          }
        ]
      },
      {
        text: '¡Gracias por su compra!',
        style: 'footer',
        margin: [0, 20, 0, 0]
      }
    ],

  
    
    footer:[{
      text:'Esperamos que vuelva!!',
      alignment:"center",
      style:'body'
    },
  ]
  }
 return docDefinition
};