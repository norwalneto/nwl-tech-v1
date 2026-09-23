import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, whatsappUrl } from '../../data/site-content';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  protected readonly contact = CONTACT;
  protected readonly whatsappUrl = whatsappUrl;
}
