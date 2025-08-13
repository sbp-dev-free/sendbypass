export interface TicketBody {
  name: string;
  email: string;
  phone_number: string;
  message: string;
  topic: string;
  subscribe: boolean;
  consent: boolean;
}

export interface TicketResponse extends TicketBody {}
