export interface Request {
  id: string;
  guestName: string;
  roomNumber: number;
  requestDetails: string;
  priority: number;
  status: 'received' | 'in progress' | 'awaiting confirmation' | 'completed' | 'canceled';
}
