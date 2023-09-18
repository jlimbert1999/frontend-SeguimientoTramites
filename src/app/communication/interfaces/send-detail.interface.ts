export interface sendDetail {
  id_mail?: string;
  attachmentQuantity: string;
  procedure: {
    _id: string;
    code: string;
  };
}
