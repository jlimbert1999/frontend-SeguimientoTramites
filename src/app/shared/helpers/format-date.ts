import * as moment from 'moment';
export const FormatDate = (date: string): string => {
  return moment(date).format('DD/MM/YYYY hh:mm');
};
