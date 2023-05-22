export function createFullName(officer: { nombre: string, paterno?: string, materno?: string, }): string {
    return [officer.nombre, officer.paterno, officer.paterno].filter(Boolean).join(" ");
}