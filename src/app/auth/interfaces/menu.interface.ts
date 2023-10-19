export interface systemMenu {
  text: string;
  icon: string;
  routerLink?: string;
  children?: {
    text: string;
    icon: string;
    routerLink: string;
  }[];
}
