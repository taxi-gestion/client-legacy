import { Type } from 'io-ts';
import { PlaceValues } from '../definitions';
import { placeCodec } from '@codecs';

export const placeValuesCodec: Type<PlaceValues> = placeCodec;
