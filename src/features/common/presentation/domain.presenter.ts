import { Kind, Nature } from '@definitions';

export const toKind = (isTwoWayDrive: boolean): Kind['kind'] => (isTwoWayDrive ? 'two-way' : 'one-way');
export const toNature = (isMedicalDrive: boolean): Nature['nature'] => (isMedicalDrive ? 'medical' : 'standard');
