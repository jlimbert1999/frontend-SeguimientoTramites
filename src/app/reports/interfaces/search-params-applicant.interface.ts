import { applicant, representative } from 'src/app/procedures/interfaces';

export interface searchParamsApplicant extends Partial<Omit<applicant, 'documento'>> {}
export interface searchParamsRepresentative extends Partial<Omit<representative, 'documento'>> {}
