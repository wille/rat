export const enum MessageType {
  Ping = 0,
  Subscribe = -1,
  Client = 1,
  Screen = 4,
  Directory = 3,
  Process = 8,

  Mouse = 41,
  MouseMove = 42,
  Key = 43,

  Transfers = 9,
  DownloadToServer = 10,
  TransferAction = 11,
  UploadToClient = 12,
}
