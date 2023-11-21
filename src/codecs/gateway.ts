import { Decode, Encode } from 'io-ts';
import { chain as eitherChain, Either, tryCatch as eitherTryCatch } from 'fp-ts/Either';
import { Errors } from './error-reporter';
import { pipe as fpipe } from 'fp-ts/function';

export const toDomainGateway =
  <Transfer, Domain>(
    decodeTransfer: Decode<unknown, Transfer>,
    encodeDomain: Encode<Transfer, Domain>,
    decodeDomain: Decode<Domain, Domain>
  ) =>
  (input: unknown): Either<Errors, Domain> =>
    fpipe(
      decodeTransfer(input),
      eitherChain(
        (transfer: Transfer): Either<Errors, Domain> =>
          eitherTryCatch(
            (): Domain => encodeDomain(transfer),
            (error: unknown): Errors => error as Errors
          )
      ),
      eitherChain((domainResult: Domain): Either<Errors, Domain> => decodeDomain(domainResult))
    );
