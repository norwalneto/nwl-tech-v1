import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, whatsappUrl } from '../../data/site-content';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  protected readonly contact = CONTACT;
  protected readonly whatsappUrl = whatsappUrl;
}
