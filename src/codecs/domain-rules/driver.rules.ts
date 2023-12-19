import { BrandC, intersection as ioIntersection, StringC, type as ioType, TypeC } from 'io-ts';
import { entityRule } from './entity.rule';
import { EmailBrand, isEmailString } from '../rules/isEmail.rule';
import { isNotEmptyString, NotEmptyStringBrand } from '../rules/isNotEmptyString.rule';

export const driverRules: TypeC<{
  identifier: BrandC<StringC, EmailBrand>;
  username: BrandC<StringC, NotEmptyStringBrand>;
}> = ioType(
  {
    identifier: isEmailString,
    username: isNotEmptyString
  },
  'driverRules'
);

// eslint-disable-next-line @typescript-eslint/typedef
export const driverEntityRules = ioIntersection([entityRule, driverRules], 'driverEntityRule');
