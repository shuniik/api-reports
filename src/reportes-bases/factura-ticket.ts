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

const style: StyleDictionary ={
  header:{
    fontSize:10,
    alignment:'center',

  },
  body:{
    fontSize:10,
    alignment:'justify'
  },
  footer:{
    fontSize:10,
    italics:true,
    alignment:'center',
    margin:[0,20,0,0]
  }
  
}

export const getFactura = ( options: ReportOptions) => {
  const { title, description,detallesFactura } = options
  const DetalleSeze = 9
  console.log(detallesFactura);
  const docDefinition: TDocumentDefinitions = {
    pageSize: {
      width:277,
      height:500
      // height:'auto'
    },
    styles:style,
    header: headerSections({
      showDate: true,
      showLogo: true,
      StoreName:'TIENDA AMORE',
    }),
    // footer: footerSection,
    pageMargins:[5,70,20,30],
    
    content: [
     
      // {
      //   qr:'https://google.com',
      //   fit:100,
      //   alignment:'center',
      // },
      {

        text:'----------- DATOS DEL COMPROBANTE -----------',
        style:'header'
      },
      {
        text:`Fecha documento: ${ DateFormater.getDate( detallesFactura[0].FECHA_DE_FACTURA)}`,
        style:'header',
      },
      {
        text:`Ticket No. ${detallesFactura[0].NUMERO_FACTURA} | ${detallesFactura[0].SERIE} `,
        style:'header',
      },
      {
        text:`Vendedor: ${detallesFactura[0].NOMBRE_USUARIO}`,
        style:'header',
      },
      {

        text:'----------- DATOS DEL COMPRADOR -----------',
        style:'header'
      },
      {

        text:`NIT: ${detallesFactura[0].NIT_CLIENTE_FACTURAR}`,
        style:'header',
      },
      {
        text:`Nombre: ${detallesFactura[0].NOMBRE_CLIENTE_FACTURAR}`,
        style:'header',
      },
      {
        text:`Dirección: ${detallesFactura[0].DIRECCION_CLIENTE_FACTURAR}`,
        style:'header',
      },
      
      {
       
        
        margin:[0,10,0,0],

        // layout:'headerLineOnly',
        layout:'lightHorizontalLines',
        
        table:{
          headerRows:1,
          // widths:['auto','auto','auto','10'],
          body:[
            [ 
              { text: 'CANT',style:'body'}, 
              { text: 'DESCRIPCIÓN',style:'body'}, 
              { text: 'PRECIO',style:'body'}, 
              { text: 'SUBT.',style:'body'}], 
              ...detallesFactura.map( detalle =>  [
                  { text: detalle.CANTIDAD_FACTURADA, fontSize:DetalleSeze,alignment:"center" },
                  { text: detalle.DESCRIPCION_LARGA,alignment:"justify",fontSize:DetalleSeze},
                  { text: CurrencyFormater.format('GTQ', +detalle.PRECIO_FINAL),fontSize:DetalleSeze},
                  { text: CurrencyFormater.format('GTQ', +detalle.TOTAL),fontSize:DetalleSeze}
                ]
              )  
          ],
        },
      },
      '\n\n',
      { text:'=============',style:'body',alignment:'right'},
      
      // totales
      
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
                  { text: 'Total',style:'body', bold:true},
                  { text: CurrencyFormater.format('GTQ',detallesFactura[0].TOTAL_GENERAL),style:'body', alignment:"right", bold:true},
                ],
              ]
            }
          },
        ]
      }
    ],

  
    
    footer: {
      text:'Esperamos que vuelva!!',
      alignment:"center",
      style:'body'
    }
  }
 return docDefinition
};