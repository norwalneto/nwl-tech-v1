import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, whatsappUrl } from '../../data/site-content';

@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  protected readonly contact = CONTACT;
  protected readonly whatsappUrl = whatsappUrl;
}
