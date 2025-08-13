export enum RequestType {
  Withdraw = "Withdraw",
  Accept = "Accept",
  Reject = "Reject",
}

export enum RequestSide {
  OUTBOX = "OUTBOX",
  INBOX = "INBOX",
}

export enum Request {
  SHIPPING = "SHIPPING",
  SHOPPING = "SHOPPING",
  SERVICE = "SERVICE",
}

export enum RequestStatus {
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
}
