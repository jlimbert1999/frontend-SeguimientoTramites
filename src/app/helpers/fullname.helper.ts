export function createFullName(person: { nombre: string, paterno: string, materno: string }): string {
    return [person.nombre, person.paterno, person.paterno].filter(Boolean).join(" ");
}