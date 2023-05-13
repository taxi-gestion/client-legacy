import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ApplicationModule } from './root/modules';

platformBrowserDynamic()
  .bootstrapModule(ApplicationModule)
  // eslint-disable-next-line no-console
  .catch((err) => console.error(err));
