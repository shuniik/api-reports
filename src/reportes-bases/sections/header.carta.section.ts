import { Content } from 'pdfmake/interfaces';
import { DateFormater } from 'src/helpers';

const logo: Content = {
  image: 'src/assets/logo-amore.png',
  width: 100,
  height: 30,
  margin: [40,40, 0, 20],
};

const currentDate: Content = {
  text: DateFormater.getDate(new Date()),
  alignment: 'right',
  margin: [0, 40,20,0],
  width: 150,
};

interface HeaderOptions {
  title?: string;
  subTitle?: string;
  showLogo?: boolean;
  showDate?: boolean;
  observations: string,
  id:string
}

export const headerCartaSections = (options: HeaderOptions): Content => {
  const { title, subTitle, showLogo = true, showDate = true,observations='', id='' } = options;

  const headerLogo: Content = showLogo ? logo : null;
  const headerDate: Content = showDate ? currentDate : null;

  const headerSubTitle: Content = subTitle
    ? {
        text: subTitle,
        alignment: 'center',
        margin: [0, 2, 0, 0],
        style: {
          fontSize: 16,
          bold: true,
        },
      }
    : null;

  const headerTitle: Content = title
    ? {
        stack: [
          {
            text: title,
            alignment: 'center',
            margin: [0, 50, 0, 0],
            style: {
              bold: true,
              fontSize: 22,
            },
          },
          headerSubTitle,
          {
            text: observations,
            alignment: 'center'
          },
          {
            text: id,
            alignment: 'center'
          } 
        
        ],
        // text: title,
        // style: {
        //   bold: true,
        // },
      }
    : null;

  return {
    columns: [headerLogo, headerTitle, headerDate],
  };
};