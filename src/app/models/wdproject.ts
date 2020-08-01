export class WDData {
    public _id: string;
    public name: string;
    public value: string;
    public isHref: Boolean;
    public encode: Boolean;

    constructor() {
    }

}

export class WDProject {

    public _id: string;
    public name: string;
    public note: string;
    public href: string;
    public status: string;
    public data: WDData[];
    public createdDate: Date;
    public createdUnix: Number;
    public updatedDate: Date;
    public updatedUnix: Number;

    constructor() {
    }

}