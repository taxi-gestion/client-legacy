import { describe, it, expect } from 'vitest';
import { firstValueFrom } from 'rxjs';
import { Toast, ToasterPresenter } from './toaster.presenter';

describe('toast presenter', (): void => {
  it('should remove a toast at specified index', async (): Promise<void> => {
    const toasterPresenter: ToasterPresenter = new ToasterPresenter();
    toasterPresenter.toast({ content: '1', title: 'Hello' });
    toasterPresenter.toast({ content: '2', title: 'Hello' });
    toasterPresenter.toast({ content: '3', title: 'Hello' });
    toasterPresenter.removeAt(1);
    const remainingToasts: Toast[] = await firstValueFrom(toasterPresenter.toasts$);

    expect(remainingToasts).toStrictEqual([
      { content: '1', title: 'Hello' },
      { content: '3', title: 'Hello' }
    ]);
  });
});
