import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export const reporte_tramites_realizados = async (columnas: string[], data: any[]) => {
    let rowData: any[] = []
    rowData.push(['Distrito', 'Registro', 'Objeto contratacion', 'Precio refenrencia', 'Fecha apertura', 'Tipo resolucion', 'Empresa adjudicada', 'Repre. Legal', 'Precio adjudicado', 'Estado', 'Oobservaciones'])
    data.forEach(element => {
        if (element) {
            rowData.push([element.origen || '', element.fecha_creacion, element.objeto || '', element.precio || '', element.fecha_apertura_sobre || '', element.tipo_resolucion || '', element.empresa_adjudicada || '', element.representante_legal || '', element.precio_adjudicado || '', element.estado || '', element.observaciones || ''])
        }

        // [element.origen, element.fecha_creacion, element.objeto, element.precio, element.fecha_apertura_sobres, element.tipo, element.empresa_adjudicada, element.representante_legal, element.precio_adjudicado, element.estado, element.observaciones]
    })
    
    const imagePath = await getBase64ImageFromUrl('../../../assets/img/logo_alcaldia.png')
    let docDefinition: any = {
        pageSize: 'A4',
        pageOrientation: 'landscape',
        content: [
            {
                text: 'Reporte contrataciones realizadas',
                style: 'header',
                alignment: 'center'
            },
            {
                text: `Fecha: ${new Date().toLocaleString()}`,
                style: 'date',
                alignment: 'right'
            },
            {
                style: 'tableExample',
                table: {
                    widths: [70, 40, 150, 50, 50, 50, 50, 50, 50, 40, 40, 50],
                    body: rowData
                }
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'justify'
            },
            date: {
                fontSize: 14,
                alignment: 'right'
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