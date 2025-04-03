import { table } from "console";
import { Content } from "pdfmake/interfaces";
import { DateFormater } from "src/helpers";

const logo: Content = {
  image: 'src/assets/logo-amore.png',
  width: 75,
  height: 16,
  alignment: 'center',
  margin: [0, 20, 0, 0] // Reduce el margen inferior
};

const currentDate: Content = {
  text: DateFormater.getDate(new Date()),
  alignment: 'center',
  margin: [0, 5, 0, 0], // Espaciado arriba
  fontSize: 10
};  

interface HeaderOptions {
  StoreName?: string;
  description?: string;
  showLogo?: boolean;
  showDate?: boolean;
}

export const headerSections = (options: HeaderOptions) => {
  const { StoreName: title, showLogo = true, showDate = true,description } = options;

  const headerLogo: Content = showLogo ? logo : null;
  const headerDate: Content = showDate ? currentDate : '';
  const headerDescription: Content =  description 
    ? {
      text: description,
      style: {
        fontSize: 10,
        alignment: 'center'
      }
    }
    : '';


  const headerTitle: Content = title 
    ? 
        {
           margin:[0,10,0,0],
          text: title, 
          style: {
            bold: true,
            fontSize: 14,
            alignment: 'center'
          }
      } 
    : '';

    // const headerTitle: Content = title 
    // ? { 
    //   stack:[
    //     {
    //       text: title, 
    //       style: {
    //         bold: true,
    //         fontSize: 14,
    //         alignment: 'center'
    //       }
    //     },
    //     headerDescription,
    //     headerSerie,
        
    //   ]
    //   } 
    // : '';

    
  // return { 
  //   columns:[
  //     headerLogo,
  //     headerTitle,
  //     headerDate
  //   ]
  // }

  return [
    headerLogo,
    headerTitle,
     headerDate
  ]
  
  
};
