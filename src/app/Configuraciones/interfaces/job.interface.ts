export interface job {
    _id: string;
    nombre: string;
    superior: string | null
    isRoot: boolean
}
export interface orgChartData {
    name: string;
    data: {
        id: string;
        pid?: string;
        name: string;
        title: string;
        img: string;
        tags?:any[];
    }[]
   
}
