export interface role {
    _id: string;
    role: string;
    privileges: {
        resource: string
        actions: string[]
    }[];
}