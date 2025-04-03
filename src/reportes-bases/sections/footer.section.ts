import { Content } from "pdfmake/interfaces";

export const footerSection = ( currentPage: number, pageCount: number ): Content =>{
  return {
    text:`Página ${currentPage} de ${pageCount}`,
    alignment:'right',
    fontSize:10,
    italics:true,
    margin:[0,0,49,0]
  }
  
}