import { groupProcedure } from "src/app/procedures/interfaces/procedures.interface";

export interface sendDetail {
    group: groupProcedure;
    amount: string;
    procedure: {
        _id: string;
        alterno: string;
    };
}