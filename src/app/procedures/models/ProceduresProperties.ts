
export type statesProcedure = 'INSCRITO' | 'OBSERVADO' | 'CONCLUIDO' | 'EN REVISION'
export interface paramsNavigation {
    limit: number
    offset: number
    text?: string
}