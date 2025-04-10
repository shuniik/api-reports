import {  StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import {  CurrencyFormater, DateFormater } from "src/helpers";
import { footerSection } from "./sections/footer.section";

import { headerCartaSections } from "./sections/header.carta.section";
import { valorizadoBod } from '../../src/reportes-bases/interfaces/valorizado.interface';
import { NumberFormater } from "src/helpers/number-formater";



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
      observations:'',
      id:`BODEGA:  ${valorizadoDet[0].CODIGO_BODEGA} - ${valorizadoDet[0].NOMBRE_BODEGA}`
    

    }),
    pageMargins:[10,140,20,30],
    
    content: [
      {
        margin: [0, 10, 0, 0],
        layout: 'lightHorizontalLines',
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
          body: [
            // Encabezados
            [ 
              { text: 'PRODUCT0', style: 'body' }, 
              { text: 'DESCRIPCION', style: 'body' }, 
              { text: 'LOTE', style: 'body' }, 
              { text: 'DESCRIP LOTE', style: 'body' },
              { text: 'VENCE?', style: 'body' },
              { text: 'VENCIMIENTO', style: 'body' },
              { text: 'DISPONIBLE', style: 'body' },
              { text: 'RESERVADA', style: 'body' },
              { text: 'STOCK', style: 'body' },
              { text: 'TIPO', style: 'body' },
              { text: 'MARCA', style: 'body' },
              { text: 'COSTO', style: 'body' },
              { text: 'VALORIZADO', style: 'body' },
            ],
    
            // Cuerpo agrupado + subtotales
            ...(() => {
              const groupedData = valorizadoDet.reduce((acc, detalle) => {
                const groupKey = `${detalle.PRODUCT0}|${detalle.DESCRIPCION_LARGA}`;
                if (!acc[groupKey]) acc[groupKey] = [];
                acc[groupKey].push(detalle);
                return acc;
              }, {});
    
              const rows = [];
              let granTotal = 0; // Para validar que coincida con totalValorizado
    
              Object.keys(groupedData).forEach(groupKey => {
                const [producto, descripcion] = groupKey.split('|');
                const detallesGrupo = groupedData[groupKey];
                let subtotalGrupo = 0;
    
                // Fila de grupo (PRODUCT0 + DESCRIPCION)
                rows.push([
                  { 
                    text: producto, 
                    colSpan: 1,
                    bold: true,
                    fillColor: '#f5f5f5'
                  },
                  { 
                    text: descripcion, 
                    colSpan: 12,
                    bold: true,
                    fillColor: '#f5f5f5'
                  },
                  ...Array(11).fill('')
                ]);
    
                // Filas de detalle
                detallesGrupo.forEach(detalle => {
                  const valorizado = (detalle.CANTIDAD_DISPONIBLE + detalle.CANTIDAD_RESERVADA) * detalle.COSTO_PROMEDIO;
                  subtotalGrupo += valorizado;
                  granTotal += valorizado;
    
                  rows.push([
                    '', // PRODUCT0 vacío
                    '', // DESCRIPCION vacía
                    { text: detalle.CODIGO_LOTE, fontSize: DetalleSeze },
                    { text: detalle.DESCRIPCION_LOTE, fontSize: DetalleSeze },
                    { text: detalle.VENCE, fontSize: DetalleSeze },
                    { text: detalle.VENCE === 'N' ? '' : DateFormater.getMonthYear(detalle.FECHA_VENCIMIENTO), fontSize: DetalleSeze },
                    { text: NumberFormater.withCommas(detalle.CANTIDAD_DISPONIBLE), fontSize: DetalleSeze },
                    { text: NumberFormater.withCommas( detalle.CANTIDAD_RESERVADA), fontSize: DetalleSeze },
                    { text: NumberFormater.withCommas( detalle.CANTIDAD_DISPONIBLE + detalle.CANTIDAD_RESERVADA), fontSize: DetalleSeze },
                    { text: detalle.DESCRIPCION_TIPO, fontSize: DetalleSeze },
                    { text: detalle.NOMBRE_MARCA, fontSize: DetalleSeze },
                    { text: CurrencyFormater.format('GTQ', detalle.COSTO_PROMEDIO), alignment: 'right', fontSize: DetalleSeze },
                    { text: CurrencyFormater.format('GTQ', valorizado), alignment: 'right', fontSize: DetalleSeze }
                  ]);
                });
    
                // Fila de SUBTOTAL del grupo
                rows.push([
                  { text: `Subtotal:`, colSpan: 12, alignment: 'right', bold: true, fillColor: '#f0f0f0' },
                  ...Array(11).fill(''),
                  { 
                    text: CurrencyFormater.format('GTQ', subtotalGrupo), 
                    alignment: 'right', 
                    bold: true,
                    fillColor: '#f0f0f0'
                  }
                ]);
              });
    
              // Validación (opcional)
              if (Math.abs(granTotal - totalValorizado) > 0.01) {
                console.warn(`¡Los subtotales no coinciden! GranTotal: ${granTotal} vs totalValorizado: ${totalValorizado}`);
              }
    
              return rows;
            })(),
    
            // Fila de TOTAL GENERAL
            [
              { text: 'TOTAL GENERAL', colSpan: 12, alignment: 'right', bold: true, fillColor: '#eeeeee' },
              ...Array(11).fill(''),
              { 
                text: CurrencyFormater.format('GTQ', totalValorizado), 
                alignment: 'right', 
                bold: true,
                fillColor: '#eeeeee' 
              }
            ]
          ]
        }
      }
    ],
  
    
    footer: footerSection
  }
 return docDefinition
};