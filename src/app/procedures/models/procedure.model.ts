import { account, typeProcedure } from 'src/app/administration/interfaces';
import { procedure, groupProcedure, stateProcedure, worker } from '../interfaces';
import { TimeControl } from 'src/app/shared/helpers';

export abstract class Procedure {
  readonly _id: string;
  readonly code: string;
  readonly type: typeProcedure;
  readonly account: account;
  readonly group: groupProcedure;
  readonly startDate: Date;
  readonly endDate?: Date;
  state: stateProcedure;
  cite: string;
  reference: string;
  amount: string;
  isSend: boolean;

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
    startDate,
    endDate,
    group,
  }: procedure) {
    this._id = _id;
    this.code = code;
    this.cite = cite;
    this.type = type;
    this.account = account;
    this.state = state;
    this.reference = reference;
    this.amount = amount;
    this.isSend = send;
    this.startDate = new Date(startDate);
    this.group = group;
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

  abstract get applicantDetails(): { emiter: worker; receiver?: worker };
}
