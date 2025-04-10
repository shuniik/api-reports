import { Content, StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { CurrencyFormater, DateFormater } from "src/helpers";
import { headerSections } from "./sections/header.section";
import { DetalleFactura } from "./interfaces/factura-det";
import { footerSection } from "./sections/footer.section";

import { headerCartaSections } from "./sections/header.carta.section";
import { KardexProducto } from "./interfaces/kardex-producto";
import { NumberFormater } from "src/helpers/number-formater";


interface ReportOptions {
  title: string;
  description: string;
  kardexProducto: KardexProducto[]
}

const style: StyleDictionary ={
  header:{
    fontSize:10,
    alignment:'center',

  },
  body:{
    fontSize:10,
    alignment:'center'
  },
  footer:{
    fontSize:10,
    italics:true,
    alignment:'center',
    margin:[0,20,0,0]
  }
  
}

export const getKardexProducto = ( options: ReportOptions) => {
  const { title, description,kardexProducto } = options
  console.log(kardexProducto);
  const DetalleSeze = 9

  const totalCantidadMovimiento = kardexProducto.reduce((acc, item) => acc + Number(item.CANTIDAD_MOVIMIENTO || 0), 0);
  
  const sortedKardex = [...kardexProducto].sort((a, b) => {
    return new Date(a.FECHA_DOCUMENTO).getTime() - new Date(b.FECHA_DOCUMENTO).getTime();
  });
  const docDefinition: TDocumentDefinitions = {
    styles:style,
    pageOrientation:"landscape",
    
    header: headerCartaSections({
      showDate: true,
      showLogo: true,
      title: title,
      subTitle: description,
      observations:kardexProducto[1].DESCRIPCION_LARGA,
      id:`${kardexProducto[1].NOMBRE_BODEGA}`
    

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
              { text: 'MOV',style:'body'}, 
              { text: 'DESCRIPCIÓN MOV',style:'body'}, 
              { text: 'NUM MOV',style:'body'}, 
              { text: 'USUARIO',style:'body'},
              { text: 'SERIE DC',style:'body'},
              { text: 'No. DC',style:'body'},
              { text: 'FECHA',style:'body'},
              { text: 'PRODUCTO',style:'body'},
              { text: 'LOTE',style:'body'},
              { text: 'CANT MOV',style:'body'},
            ], 
              ...sortedKardex.map( detalle =>  [
                  { text: detalle.CODIGO_MOV_INVE, fontSize:DetalleSeze,alignment:"center" },
                  { text: detalle.DESCRIP_MOV_INVENTARIO,alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.NUMERO_MOVIMIENTO,alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.NOMBRE_USUARIO,alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.SERIE_DOCUMENTO_REF,alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.NUMERO_DOCUMENTO_REF,alignment:"justify",fontSize:DetalleSeze},
                  { text: DateFormater.getDate( detalle.FECHA_DOCUMENTO),alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.PRODUCT0,alignment:"justify",fontSize:DetalleSeze},
                  { text: detalle.CODIGO_LOTE,alignment:"justify",fontSize:DetalleSeze},
                  { text: NumberFormater.withCommas( detalle.CANTIDAD_MOVIMIENTO),alignment:"center",fontSize:DetalleSeze}
                ]
              ),
              [
                { text: '', colSpan: 9, border: [false, true, false, true] }, '', '', '', '', '', '', '', '',
                { 
                  text: `Su existencia debería ser: ${ NumberFormater.withCommas( totalCantidadMovimiento)}` , 
                  bold: true, 
                  fontSize: 11, 
                  alignment: 'center',
                  fillColor: '#eeeeee'
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