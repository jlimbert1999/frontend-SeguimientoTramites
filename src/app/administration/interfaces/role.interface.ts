export interface role {
  _id: string;
  name: string;
  permissions: permissions[];
}
export interface permissions {
  resource: string;
  actions: string[];
}

export interface systemModule {
  group: string;
  resources: resource[];
}
export interface resource {
  text: string;
  value: string;
  disabled: boolean;
  actions: { value: string; viewValue: string }[];
}
