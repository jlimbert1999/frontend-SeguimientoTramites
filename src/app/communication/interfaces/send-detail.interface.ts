export interface sendDetail {
    group: 'ExternalProcedure' | 'InternalProcedure';
    procedure: {
        _id: string;
        alterno: string;
        amount: string;
    };
}