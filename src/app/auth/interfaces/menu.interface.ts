export interface menu {
  text: string;
  icon: string;
  children?: child[];
  routerLink: string;
}

export interface child {
  text: string;
  icon: string;
  routerLink: string;
}
