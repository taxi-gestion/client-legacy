import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './missing-admin-configuration.page.html'
})
export class MissingAdminConfigurationPage {}
