import { account, typeProcedure } from 'src/app/administration/interfaces';
import { groupProcedure, stateProcedure, worker } from '../interfaces';
import { TimeControl } from 'src/app/shared/helpers';

interface ProcedureProps {
  _id: string;
  code: string;
  cite: string;
  amount: string;
  isSend: boolean;
  reference: string;
  endDate?: string;
  startDate: string;
  account: account;
  type: typeProcedure;
  group: groupProcedure;
  state: stateProcedure;
}

export abstract class Procedure {
  public readonly _id: string;
  public readonly code: string;
  public readonly type: typeProcedure;
  public readonly account: account;
  public readonly group: groupProcedure;
  public readonly startDate: Date;
  public readonly endDate?: Date;
  public state: stateProcedure;
  public cite: string;
  public reference: string;
  public amount: string;
  public isSend: boolean;

  constructor({
    _id,
    code,
    cite,
    type,
    account,
    state,
    reference,
    amount,
    isSend,
    startDate,
    endDate,
    group,
  }: ProcedureProps) {
    this._id = _id;
    this.code = code;
    this.cite = cite;
    this.type = type;
    this.account = account;
    this.state = state;
    this.reference = reference;
    this.amount = amount;
    this.isSend = isSend;
    this.group = group;
    this.startDate = new Date(startDate);
    if (endDate) this.endDate = new Date(endDate);
  }

  get fullNameManager() {
    if (!this.account.funcionario) return `DESVINCULADO`;
    const jobtitle = this.account.funcionario.cargo ? this.account.funcionario.cargo.nombre : 'Sin cargo';
    return `${this.account.funcionario.nombre} ${this.account.funcionario.paterno} ${this.account.funcionario.materno} (${jobtitle})`;
  }

  get citeCode() {
    if (this.cite === '') return 'S/C';
    return this.cite;
  }

  get isEditable(): boolean {
    if (this.state !== stateProcedure.INSCRITO) return false;
    return true;
  }

  get canBeManaged() {
    if (this.state !== stateProcedure.INSCRITO || this.isSend) return false;
    return true;
  }

  getDuration(): string {
    return TimeControl.duration(this.startDate, this.endDate ?? new Date());
  }

  StartDateDetail(): { date: string; hour: string } {
    return {
      date: TimeControl.formatDate(this.startDate, 'DD/MM/YY'),
      hour: TimeControl.formatDate(this.startDate, 'HH:mm'),
    };
  }
  abstract get applicantDetails(): { emiter: worker; receiver: worker };
}
