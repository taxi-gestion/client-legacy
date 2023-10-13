import { Kind, Nature } from '@definitions';

export const toKind = (isTwoWayDrive: boolean): Kind => (isTwoWayDrive ? 'two-way' : 'one-way');
export const toNature = (isMedicalDrive: boolean): Nature => (isMedicalDrive ? 'medical' : 'standard');
