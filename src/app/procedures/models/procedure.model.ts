import { account, typeProcedure } from 'src/app/administration/interfaces';
import { procedure, groupProcedure, stateProcedure } from '../interfaces';
import * as moment from 'moment';

export class Procedure {
  _id: string;
  code: string;
  cite: string;
  type: typeProcedure;
  account: account;
  state: stateProcedure;
  reference: string;
  amount: string;
  send: boolean;
  group: groupProcedure;
  startDate: Date;
  endDate?: Date;
  tramite: string;
  constructor({
    _id,
    code,
    cite,
    type,
    account,
    state,
    reference,
    amount,
    send,
    group,
    startDate,
    endDate,
  }: procedure) {
    this._id = _id;
    this.code = code;
    this.cite = cite;
    this.type = type;
    this.account = account;
    this.state = state;
    this.reference = reference;
    this.amount = amount;
    this.send = send;
    this.group = group;
    this.startDate = new Date(startDate);
    if (endDate) this.endDate = new Date(endDate);
  }

  get fullNameManager() {
    if (!this.account.funcionario) return `DESVINCULADO`;
    const jobtitle = this.account.funcionario.cargo
      ? this.account.funcionario.cargo.nombre
      : 'Sin cargo';
    return `${this.account.funcionario.nombre} ${this.account.funcionario.paterno} ${this.account.funcionario.materno} (${jobtitle})`;
  }

  getDuration(): string {
    const parts: string[] = [];
    const start = moment(this.startDate);
    const end = this.endDate ? moment(this.endDate) : moment(new Date());
    const duration = moment.duration(end.diff(start));
    if (duration.years() >= 1) {
      const years = Math.floor(duration.years());
      parts.push(years + ' ' + (years > 1 ? 'años' : 'año'));
    }
    if (duration.months() >= 1) {
      const months = Math.floor(duration.months());
      parts.push(months + ' ' + (months > 1 ? 'meses' : 'mes'));
    }
    if (duration.days() >= 1) {
      const days = Math.floor(duration.days());
      parts.push(days + ' ' + (days > 1 ? 'dias' : 'dia'));
    }
    if (duration.hours() >= 1) {
      const hours = Math.floor(duration.hours());
      parts.push(hours + ' ' + (hours > 1 ? 'horas' : 'hora'));
    }
    if (duration.minutes() >= 1) {
      const minutes = Math.floor(duration.minutes());
      parts.push(minutes + ' ' + (minutes > 1 ? 'minutos' : 'minuto'));
    }
    if (duration.seconds() >= 1) {
      const seconds = Math.floor(duration.seconds());
      parts.push(seconds + ' ' + (seconds > 1 ? 'segundos' : 'segundo'));
    }
    return parts.join(', ');
  }
}
