export interface ReportTotalProcedures {
  _id: string;
  details: detail[];
  total: number;
  name: string;
}
interface detail {
  field: string;
  count: number;
}
