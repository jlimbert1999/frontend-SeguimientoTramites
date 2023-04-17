export interface SendDataReportEvent {
    data: any[],
    group: 'tramites_externos' | 'tramites_internos',
    searchParams: {
        field: string
        value: string
    }[]
}