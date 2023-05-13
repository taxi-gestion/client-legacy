import { Inject, Pipe, PipeTransform } from '@angular/core';
import { FIELD_ERROR_MESSAGES_CONFIGURATION, FieldErrorMessages } from '../providers';
import { fieldErrorMessagesPresentation } from '../presentation';

@Pipe({ name: 'fieldErrorMessages' })
export class FieldErrorPipe<T> implements PipeTransform {
  public constructor(
    @Inject(FIELD_ERROR_MESSAGES_CONFIGURATION)
    private readonly _fieldErrorMessages: FieldErrorMessages<T>
  ) {}

  public transform(errors: T, errorMessagesKey: string): string[] {
    return fieldErrorMessagesPresentation(errors, this._fieldErrorMessages.get(errorMessagesKey));
  }
}
