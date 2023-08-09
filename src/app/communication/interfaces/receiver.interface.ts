import { Officer } from "src/app/administration/models/officer.model";

export interface receiver {
    id_account: string
    officer: Officer
    online: boolean
}