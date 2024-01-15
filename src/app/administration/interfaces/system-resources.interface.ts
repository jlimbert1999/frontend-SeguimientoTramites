import { validResources } from './vadid-resources.enum';

export interface systemResource {
  value: validResources;
  label: string;
  actions: action[];
  isSelected: boolean;
}
export interface action {
  value: string;
  label: string;
  isSelected: boolean;
}
