export interface role {
    _id:        string;
    role:       string;
    privileges: privilege[];
}

export interface privilege {
    resource: string;
    create:   boolean;
    update:   boolean;
    read:     boolean;
    delete:   boolean;
}
