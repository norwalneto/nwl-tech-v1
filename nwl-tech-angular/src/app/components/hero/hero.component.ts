import { ChangeDetectionStrategy, Component } from '@angular/core';
import { whatsappUrl } from '../../data/site-content';

@Component({
  selector: 'app-hero',
  standalone: true,
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  protected readonly whatsappUrl = whatsappUrl;
}
