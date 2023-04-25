export interface SendDataReportEvent {
    data: any[],
    group: 'tramites_externos' | 'tramites_internos',
    params: any,
    extras?:any
}