export interface account {
    id_account: string,
    id_dependencie: string
    officer: {
        id_officer: string
        fullname: string
        jobtitle: string
    }
}
export interface userSocket {
    id_account: string,
    id_dependencie: string
    officer: {
        id_officer: string,
        fullname: string
        jobtitle: string
    },
    socketIds: string[]
}
