import { ChangeDetectionStrategy, Component } from '@angular/core';
import { whatsappUrl } from '../../data/site-content';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  protected readonly whatsappUrl = whatsappUrl;
}
