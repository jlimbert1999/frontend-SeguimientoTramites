export interface Menu {
  text: string;
  icon: string;
  children?: Child[];
  routerLink: string;
}

export interface Child {
  text: string;
  icon: string;
  routerLink: string;
}
