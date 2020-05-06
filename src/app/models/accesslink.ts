export class Accesslink{
  
    public _id: string;
    public title: string;
    public url: string;
    public description: string;
    public enabled: boolean;
    public createdDate: Date;
    public createdUnix: Number;
    public updatedDate: Date;
    public updatedUnix: Number;
  
  constructor()
  {
  }

  static instanceToSave(pTitle:string,pUrl:string,pDescription:string,pEnabled:boolean) : Accesslink {

    var entity= new Accesslink();
    entity.title=pTitle;
    entity.url=pUrl;
    entity.description=pDescription;
    entity.enabled=pEnabled;

    return entity;
  }

}
