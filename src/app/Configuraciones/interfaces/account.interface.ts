import { Officer } from "src/app/shared/components/list-workflow/list-workflow.component";
import { Dependency } from "./dependency.interface";

export interface account {
    _id: string;
    dependencia: Dependency
    login: string;
    rol: string;
    funcionario: Officer;
    activo: boolean;
}