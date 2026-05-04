export type RoomKeyStatus = 'active'|'reserved'|'on_hold'|'revoked'|'expired';
export interface Suite { id:string; name:string; client:string; roomKeyStatus:RoomKeyStatus; stayStart:string; stayEnd:string; deliverables:string[]; }
export interface HouseRecordEntry { id:string; actor:string; action:string; timestamp:string; roomKeyStatus:RoomKeyStatus; standingOrderTag:'Director'|'Principal'|'Operations'|'Finance'|'Front Desk'; }
