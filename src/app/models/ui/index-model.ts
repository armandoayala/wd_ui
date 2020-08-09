export class IndexModel<T>{

    public count: number = 0;
    public hasMore: Boolean = false;
    public result: T[] = [];

    constructor(
    ) { }

}