import { groupProcedure } from '../interfaces';

export function stringToEnum(path: string): groupProcedure | null {
  const urlToEnumMap: { [key: string]: groupProcedure } = {
    externos: groupProcedure.EXTERNAL,
    internos: groupProcedure.INTERNAL,
  };
  return urlToEnumMap[path] || null;
}

export function EnumToString(enumValue: groupProcedure): string | null {
  const enumToUrlMap: { [key in groupProcedure]: string } = {
    [groupProcedure.EXTERNAL]: 'externos',
    [groupProcedure.INTERNAL]: 'internos',
  };
  return enumToUrlMap[enumValue] || null;
}
