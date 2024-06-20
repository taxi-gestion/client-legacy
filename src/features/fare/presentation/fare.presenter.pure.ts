import { WithNature } from '../../../definitions';

export const isMedicalDrive = (nature: WithNature['nature']): boolean => nature === 'medical';
