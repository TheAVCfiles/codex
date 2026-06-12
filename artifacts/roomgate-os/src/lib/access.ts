import { RoomKeyStatus } from '../models/types';
export const canAccessSuite = (status: RoomKeyStatus) => status === 'active';
export const statusCopy: Record<RoomKeyStatus, string> = {
active:'', reserved:'Reserved. Stay has not started yet.', on_hold:'Access on hold pending account update.', revoked:'Access restricted. Contact Front Desk.', expired:'This stay has concluded. Contact Front Desk to reserve a new suite.'
};
