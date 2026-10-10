import { ChangeDetectionStrategy, Component } from '@angular/core';
import { whatsappUrl } from '../../data/site-content';

@Component({
  selector: 'app-services',
  standalone: true,
  templateUrl: './services.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent {
  protected readonly whatsappUrl = whatsappUrl;
}
