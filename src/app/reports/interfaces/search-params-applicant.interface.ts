import { applicant } from 'src/app/procedures/interfaces';

export interface searchParamsApplicant extends Partial<Omit<applicant, 'documento'>> {}
