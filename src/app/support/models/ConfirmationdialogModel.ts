export class ConfirmationdialogModel 
{
  public title: string;
  public message: string;
  public btnOkLabel: string;
  public btnCancelLabel: string;
  public dialogSize: string;

  public static readonly DIALOG_SIZE_SM = "sm";
  public static readonly DIALOG_SIZE_LG = "lg";

  constructor()
  {
      this.title="general.title_confirmation";
      this.btnOkLabel="general.label_accept";
      this.btnCancelLabel="general.label_cancel";
      this.dialogSize=ConfirmationdialogModel.DIALOG_SIZE_SM;
  }

  static defaultDialog(pMessage:string = 'general.message_confirmation')
  {
    var entity=new ConfirmationdialogModel();
    entity.message=pMessage;
    return entity;
  }

}