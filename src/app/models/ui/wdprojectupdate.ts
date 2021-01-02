import { WDData } from "../wdproject";

export class WDDataAdd {
  public id: string = null;
  public name: string = null;
  public value: string = null;
  public url: string = null;
  public isHref: boolean = false;
  public encode: boolean = false;
  public isNotValid: boolean = false;
  public description: string = null;
  public wdDataIsDecoded: boolean = false;
  public wdDisabledEncrypt: boolean = false;
  public wdReadOnly: boolean = false;

  constructor() {}

  static copyToInstance(pWdData: WDData): WDDataAdd {
    var entity = new WDDataAdd();

    entity.id = pWdData._id;
    entity.name = pWdData.name;
    entity.value = pWdData.value;
    entity.url = pWdData.url;
    entity.isHref = pWdData.isHref && pWdData.isHref === true ? true : false;
    entity.encode = pWdData.encode && pWdData.encode === true ? true : false;
    entity.description = pWdData.description;

    return entity;
  }
}

export class WDProjectUpdate {
  public note?: string = null;
  public client?: string = null;
  public href?: string = null;

  constructor() {}
}
