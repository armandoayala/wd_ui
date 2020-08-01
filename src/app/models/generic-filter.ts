export class ExtraFilter {
    field: string
    value: string
}

export class QueryFilter {
    status: string
    query: string
    extras: ExtraFilter[]
}

export class GenericFilter {
    constructor(
        //Se puede declarar aqui las propiedades como forma de atajo,
        //Sino deberia declaralo por fuera y luego pasar por parametro en el constructor
        public filter: QueryFilter,
        public sort: any
    ) {

    }
}
