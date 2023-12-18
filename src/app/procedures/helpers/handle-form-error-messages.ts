import { FormGroup } from '@angular/forms';

export enum ValidationTypes {
  onlyLetters = '^[a-zA-Z ]*$',
  onlyNumbers = '^[0-9]*$',
  alphaNumeric = '^[a-zA-Z0-9]*$',
}
export const HandleFormErrorMessages = (Form: FormGroup, path: string) => {
  const control = Form.get(path);
  if (!control) return '';
  if (control.hasError('required')) return 'Este campo es obligatorio';
  if (control.hasError('minlength')) {
    return `Ingrese al menos ${control.getError('minlength').requiredLength} caracteres`;
  }
  if (control.hasError('maxlength')) {
    return `Ingrese al menos ${control.getError('maxlength').requiredLength} caracteres`;
  }
  if (control.getError('pattern')) {
    let message = '';
    switch (control.getError('pattern').requiredPattern) {
      case ValidationTypes.onlyLetters:
        message = 'Solo letras';
        break;
      case ValidationTypes.onlyNumbers:
        message = "Solo numeros";
        break;
      case ValidationTypes.alphaNumeric:
        return 'Solo letras y numeros';
      default:
        break;
    }
    return message;
  }
  return 'Error desconocido';
};
