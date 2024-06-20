import { ApplicationRootLayout } from './application-root/application-root.layout';
import { MainLayout } from './main/main.layout';
import { MobileLayout } from './mobile/mobile.layout';

export * from './application-root/application-root.layout';
export * from './main/main.layout';

// eslint-disable-next-line @typescript-eslint/typedef
export const LAYOUTS = [ApplicationRootLayout, MainLayout, MobileLayout];
