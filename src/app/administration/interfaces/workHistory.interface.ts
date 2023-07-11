import { job } from "./job.interface";
import { officer } from "./oficer.interface";

export interface workHistory {
    _id: string;
    officer: officer;
    job: job;
    date: string;
}