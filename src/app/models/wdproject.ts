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
    public client: string;
    public status: string;
    public wddata: WDData[];
    public createdDate: Date;
    public createdUnix: Number;
    public updatedDate: Date;
    public updatedUnix: Number;

    constructor() {
    }

    static instanceToSave(pName:string,pHref:string,pClient:string) : WDProject {

        var entity= new WDProject();
        entity.name=pName;
        entity.href=pHref;
        entity.client=pClient;
    
        return entity;
      }

}