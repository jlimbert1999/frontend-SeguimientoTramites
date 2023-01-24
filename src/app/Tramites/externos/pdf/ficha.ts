import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from "pdfmake/interfaces";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import * as moment from 'moment';
import { ExternoData } from "../models/externo.model";

export const Ficha = async (tramite: ExternoData) => {
    const img1: any = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia.png')
    let docDefinition: TDocumentDefinitions
    let solicitante: Content
    if (tramite.solicitante.tipo === 'NATURAL') {
        solicitante = [
            {
                text: `SOLICITANTE: ${tramite.solicitante.nombre} ${tramite.solicitante.paterno} ${tramite.solicitante.materno}`,
                alignment: 'center'
            },
            {
                text: `${tramite.solicitante.documento}: ${tramite.solicitante.dni}`,
                alignment: 'center'
            }
        ]
    }
    else {
        solicitante = {
            text: `SOLICITANTE: ${tramite.solicitante.nombre}\n\n`,
            alignment: 'center'
        }
    }
    docDefinition = {
        pageSize: 'A6',
        content: [
            {
                image: img1,
                width: 90,
                height: 90,
                alignment: 'center'
            },
            {
                text: 'GOBIERNO AUTONOMO MUNICIPAL DE SACABA.\n\n',
                alignment: 'center'
            },
            {
                text: `Tramite: ${tramite.tipo_tramite.nombre}\n\n`,
                alignment: 'center'
            },
            {
                text: `Fecha registro:  ${moment(new Date(tramite.fecha_registro)).format('DD-MM-YYYY HH:mm:ss')}\n\n`,
                alignment: 'center'
            },
            {
                text: `Alterno: ${tramite.alterno}\n\n`,
                alignment: 'center'
            },
            {
                text: `PIN: ${tramite.pin}\n\n`,
                alignment: 'center'
            },
            solicitante
        ],
        styles: {
            header: {
                fontSize: 14,
                bold: true,
                alignment: 'justify'
            }
        }
    };
    pdfMake.createPdf(docDefinition).print();
}


const getBase64ImageFromUrl = async (imageUrl: string) => {
    var res = await fetch(imageUrl);
    var blob = await res.blob();
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.addEventListener("load", function () {
            resolve(reader.result);
        }, false);
        reader.readAsDataURL(blob);
    })
}