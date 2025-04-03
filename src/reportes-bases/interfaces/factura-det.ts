export interface DetalleFactura {
  CODIGO_DE_CLIENTE: number;      
  CODIGO_DE_CONDICION: number;    
  TOTAL_GENERAL:number ;           
  NOMBRE_CLIENTE_FACTURAR: string;
  NIT_CLIENTE_FACTURAR: string;   
  DIRECCION_CLIENTE_FACTURAR: string;
  TOTA_DESCUENTO: number;         
  PRODUCT0: string;               
  DESCRIPCION_LARGA: string;      
  CANTIDAD_FACTURADA: number;               
  TOTAL: number;                  
  NUMERO_FACTURA: number;     
  SERIE: string;
  FECHA_DE_FACTURA: Date;
  PRECIO_FINAL:Number;
  NOMBRE_USUARIO: string;
  CODIGO_USUARIO: Number
}
