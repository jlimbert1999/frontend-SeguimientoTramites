import { Content } from 'pdfmake/interfaces';
import { account } from 'src/app/administration/interfaces';
function createContent(account: account, password: string): Content {
  return [
    {
      text: [
        'NOMBRE: ',
        {
          text: `${account.funcionario?.nombre} ${account.funcionario?.paterno} ${account.funcionario?.materno}\n\n`.toUpperCase(),
          bold: false,
        },
        'CARGO: ',
        {
          text: `${account.funcionario?.cargo ? account.funcionario.cargo.nombre : 'SIN CARGO'}\n\n`,
          bold: false,
        },
        'UNIDAD: ',
        {
          text: `${account.dependencia.nombre} - ${account.dependencia.institucion.sigla}`.toUpperCase(),
          bold: false,
        },
      ],

      style: 'header',
      alignment: 'center',
      fontSize: 12,
    },
    {
      text: '\n\nCUENTA',
      style: 'header',
      alignment: 'center',
    },
    {
      text: [
        'Usuario: ',
        { text: `${account.login}\n\n`, bold: false },
        'Contraseña: ',
        { text: `${password ? password : '*********'}\n\n`, bold: false },
      ],
      style: 'header',
      alignment: 'center',
      fontSize: 12,
    },
    {
      text: 'La contraseña ingresada en el reporte debe ser cambiada una vez ingresada al sistema para que sea solo de conocimiento del usuario ',
      style: 'header',
      alignment: 'center',
      fontSize: 10,
    },
    {
      text: '\n\nEs responsabilidad del usuario el uso de la cuenta asignada\n\n',
      style: 'header',
      alignment: 'center',
      fontSize: 10,
    },
    {
      qr: `${account.funcionario?.nombre} ${account.funcionario?.paterno} ${account.funcionario?.materno} Dni: ${account.funcionario?.dni}`,
      alignment: 'right',
      fit: 100,
    },
    {
      columns: [
        {
          width: 90,
          text: '',
        },
        {
          width: '*',
          text: 'Sello y firma \n USUARIO',
          alignment: 'center',
        },
        {
          width: '*',
          text: 'Sello y firma \n ADMINISTRADOR',
          alignment: 'center',
        },
        {
          width: 90,
          text: '',
        },
      ],
    },
  ];
}

export const AccountSheet = {
  createContent,
};
