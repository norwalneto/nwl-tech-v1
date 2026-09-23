import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, whatsappUrl } from '../../data/site-content';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly contact = CONTACT;
  protected readonly whatsappUrl = whatsappUrl;
}
