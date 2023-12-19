import { TaskEither } from 'fp-ts/TaskEither';
import { Errors } from '../codecs';

export type ConditionOnDomain<Domain, DomainNarrow extends Domain> = (domain: Domain) => domain is DomainNarrow;
export type AdapterOperation<EncodedAdapter> = (payload: EncodedAdapter) => TaskEither<Errors, unknown>;
export type EncodeToDomain<DomainNarrow, EncodedDomain> = (narrowed: DomainNarrow) => EncodedDomain;
export type EncodeToAdapter<EncodedDomain, EncodedAdapter> = (encodedDomain: EncodedDomain) => EncodedAdapter;

/* eslint-disable @typescript-eslint/no-explicit-any */
export type StrategyPipeline<
  Domain extends object,
  Narrow extends Domain = any,
  EncodedDomain extends object = object,
  EncodedAdapter extends object = object
> = [
  ConditionOnDomain<Domain, Narrow>,
  EncodeToDomain<Narrow, EncodedDomain>,
  EncodeToAdapter<EncodedDomain, EncodedAdapter>,
  AdapterOperation<EncodedAdapter>
];
/* eslint-enable @typescript-eslint/no-explicit-any */
