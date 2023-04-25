import * as moment from "moment";
import { Table } from "pdfmake/interfaces";

export function createHeaderParamsPDF(params: any): Table {
    let tableParams: Table = {
        headerRows: 1,
        dontBreakRows: true,
        widths: [150, '*'],
        body: [[{ text: 'CAMPO', style: 'tableHeader', alignment: 'center' }, { text: 'VALOR A BUSCAR', style: 'tableHeader', alignment: 'center' }]]
    }
    for (let key in params) {
        if (params[key] !== '' && params[key] !== null) {
            switch (key) {
                case 'start':
                    tableParams.body.push([{ text: 'FECHA INICIAL', bold: true }, { text: moment(params[key]).format('DD-MM-YYYY HH:mm:ss') }])
                    break;
                case 'end':
                    tableParams.body.push([{ text: 'FECHA FIN', bold: true }, { text: moment(params[key]).format('DD-MM-YYYY HH:mm:ss') }])
                    break;
                case 'id_cuenta':
                    break;
                default:
                    tableParams.body.push([{ text: key.toUpperCase(), bold: true }, { text: params[key] }])
                    break;
            }
        }
    }
    if (tableParams.body.length === 1) tableParams.body.push([{ text: 'Sin parametros para la busqueda', colSpan: 2 }, ''])
    return tableParams
}