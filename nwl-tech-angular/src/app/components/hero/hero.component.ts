import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT, whatsappUrl } from '../../data/site-content';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  protected readonly contact = CONTACT;
  protected readonly whatsappUrl = whatsappUrl;
}
