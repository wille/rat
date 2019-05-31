export const enum MessageType {
  Ping = 0,
  Shell = 5,
  Subscribe = -1,
  Client = 1,
  Screen = 4,
  Directory = 3,
  Process = 8,

  RequestTransfers = 10,
  UploadToClient = 12,
  TransferUpdateEvent = 13,

  ///////////////////////////
  Mouse = 41,
  MouseMove = 42,
  Key = 43,

  Transfers = 9,
  TransferAction = 11,
}
