import {  StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import {  CurrencyFormater, DateFormater } from "src/helpers";
import { footerSection } from "./sections/footer.section";

import { headerCartaSections } from "./sections/header.carta.section";
import { valorizadoBod } from '../../src/reportes-bases/interfaces/valorizado.interface';



interface ReportOptions {
  title: string;
  description: string;
  valorizadoDet: valorizadoBod[]
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

export const getValorizado = ( options: ReportOptions) => {
  const { title, description,valorizadoDet } = options
  console.log(valorizadoDet);
  const DetalleSeze = 9
  const totalValorizado = valorizadoDet.reduce((acc, detalle) => {
    const disponible = Number(detalle.CANTIDAD_DISPONIBLE || 0);
    const reservada = Number(detalle.CANTIDAD_RESERVADA || 0);
    const costo = Number(detalle.COSTO_PROMEDIO || 0);
    return acc + (disponible + reservada) * costo;
  }, 0);
  const docDefinition: TDocumentDefinitions = {
    styles:style,
    pageOrientation:"landscape",
    
    header: headerCartaSections({
      showDate: true,
      showLogo: true,
      title: title,
      subTitle: description,
      observations:valorizadoDet[0].DESCRIPCION_LARGA,
      id:`BODEGA:  ${valorizadoDet[0].CODIGO_BODEGA} - ${valorizadoDet[0].NOMBRE_BODEGA}`
    

    }),
    // footer: footerSection,
    pageMargins:[50,140,20,30],
    
    content: [
    
       {
       
        
        margin:[0,10,0,0],

        // layout:'headerLineOnly',
        layout:'lightHorizontalLines',
        
        table:{
          headerRows:1,
          // widths:['auto','auto','auto','10'],
          body:[
            [ 
              { text: 'LOTE',style:'body'}, 
              { text: 'DESCRIP LOTE',style:'body'},
              { text: 'VENCE?',style:'body'},
              { text: 'VENCIMIENTO',style:'body'},
              { text: 'DISPONIBLE',style:'body'},
              { text: 'RESERVADA',style:'body'},
              { text: 'STOCK',style:'body'},
              { text: 'TIPO',style:'body'},
              { text: 'MARCA',style:'body'},
              { text: 'COSTO',style:'body'},
              { text: 'VALORIZADO',style:'body'},
            ], 
              ...valorizadoDet.map( detalle =>  [
                  { text: detalle.CODIGO_LOTE,alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.DESCRIPCION_LOTE,alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.VENCE,alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.VENCE === 'N' ? '' : DateFormater.getMonthYear(detalle.FECHA_VENCIMIENTO)},
                  { text: detalle.CANTIDAD_DISPONIBLE,alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.CANTIDAD_RESERVADA,alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.CANTIDAD_DISPONIBLE + detalle.CANTIDAD_RESERVADA ,alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.DESCRIPCION_TIPO,alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.NOMBRE_MARCA,alignment:"justify",fontSize:DetalleSeze},
                  { text: CurrencyFormater.format('GTQ', detalle.COSTO_PROMEDIO),alignment:"right",fontSize:DetalleSeze},
                  { text: CurrencyFormater.format('GTQ',(detalle.CANTIDAD_DISPONIBLE+detalle.CANTIDAD_RESERVADA) * detalle.COSTO_PROMEDIO),alignment:"right",fontSize:DetalleSeze}
                ]
              ),
              //MOSTRAR TOTOTAL
              [
                { text: 'TOTAL', colSpan: 10, alignment: 'right', bold: true, fillColor: '#eeeeee', margin: [0, 5, 0, 5] },
                ...Array(9).fill(''), // relleno por colSpan
                { 
                  text: CurrencyFormater.format('GTQ', totalValorizado), 
                  alignment: 'right', 
                  bold: true,
                  fillColor: '#eeeeee', 
                  margin: [0, 5, 0, 5]
                }
              ]
             
          ],
        },
      // },
      // '\n\n',

      
      // totales
      
      // {
        
      //   columns:[
      //     { width:'*',
      //       text:''
      //     },
      //     { 
      //       width:'auto',
      //       layout:'noBorders',
      //       table:{
      //         body:[
               
      //           [
      //             { text: 'Subtotal',style:'body'},
      //             { text: CurrencyFormater.format('GTQ',detallesFactura[0].TOTAL_GENERAL + detallesFactura[0].TOTA_DESCUENTO),style:'body', alignment:"right"},
      //           ],
      //           [
      //             { text: 'Descuento',style:'body'},
      //             { text: CurrencyFormater.format('GTQ',detallesFactura[0].TOTA_DESCUENTO),style:'body', alignment:"right"},
      //           ],
      //           [
      //             { text:'',style:'body', alignment:"right"},
      //             { text: '_________________',style:'body'},
      //           ],
      //           [
      //             { text: 'Total',style:'body', bold:true},
      //             { text: CurrencyFormater.format('GTQ',detallesFactura[0].TOTAL_GENERAL),style:'body', alignment:"right", bold:true},
      //           ],
      //         ]
      //       }
      //     },
      //   ]
       }
     ],

  
    
    footer: footerSection
  }
 return docDefinition
};