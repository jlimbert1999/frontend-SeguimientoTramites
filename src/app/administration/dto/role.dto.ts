export class rolDto {
    role: string
    privileges: {
        resource: string;
        create: boolean;
        update: boolean;
        read: boolean;
        delete: boolean;
    }[]
}


