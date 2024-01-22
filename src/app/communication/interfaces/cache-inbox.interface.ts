import { Communication } from '../models';
import { statusMail } from './status-mail';

export interface InboxCache {
  communications: Communication[];
  status?: statusMail;
  text: string;
  length: number;
}
export const INBOX_CACHE = 'ImboxComponent';
