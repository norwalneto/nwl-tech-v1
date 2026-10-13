import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
import { ConnectivitySceneComponent } from '../connectivity-scene/connectivity-scene.component';
import { whatsappUrl } from '../../data/site-content';

type RevertibleAnimationContext = { revert(): void };

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [ConnectivitySceneComponent],
  templateUrl: './hero.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  protected readonly whatsappUrl = whatsappUrl;

  private readonly host: HTMLElement;
  private animationContext?: RevertibleAnimationContext;
  private motionTimer = 0;
  private scrollFrame = 0;
  private destroyed = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {
    this.host = this.elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    window.addEventListener('scroll', this.handleScroll, { passive: true });
    window.addEventListener('resize', this.handleScroll, { passive: true });
    this.handleScroll();

    window.requestAnimationFrame(() => {
      this.motionTimer = window.setTimeout(() => void this.startMotion(), 180);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.motionTimer) window.clearTimeout(this.motionTimer);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
    if (this.scrollFrame) window.cancelAnimationFrame(this.scrollFrame);
    this.animationContext?.revert();
  }

  private readonly handleScroll = (): void => {
    if (this.scrollFrame) return;

    this.scrollFrame = window.requestAnimationFrame(() => {
      this.scrollFrame = 0;
      const bounds = this.host.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -bounds.top / Math.max(bounds.height, 1)));

      this.host.style.setProperty('--hero-scroll-logo-y', `${-progress * 42}px`);
      this.host.style.setProperty('--hero-scroll-copy-y', `${-progress * 18}px`);
      this.host.style.setProperty('--hero-scroll-aura-y', `${-progress * 34}px`);
    });
  };

  private async startMotion(): Promise<void> {
    let gsapModule: typeof import('gsap');
    try {
      gsapModule = await import('gsap');
    } catch (error) {
      console.error('Não foi possível carregar as animações do hero:', error);
      return;
    }

    if (this.destroyed) return;

    const gsap = gsapModule.gsap;

    this.animationContext = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });

      intro
        .fromTo(
          '[data-hero-aura]',
          { autoAlpha: 0, scale: 0.76 },
          { autoAlpha: 0.88, scale: 1, duration: 0.8, ease: 'power2.out' },
        )
        .fromTo(
          '[data-hero-particle]',
          { autoAlpha: 0, scale: 0.45, y: 10 },
          { autoAlpha: 0.9, scale: 1, y: 0, duration: 0.58, stagger: 0.1 },
          '-=0.42',
        )
        .fromTo(
          '[data-hero-eyebrow]',
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.52 },
          '<+0.07',
        )
        .fromTo(
          '[data-hero-line]',
          { autoAlpha: 0, yPercent: 105, rotationX: -7 },
          {
            autoAlpha: 1,
            yPercent: 0,
            rotationX: 0,
            duration: 0.68,
            stagger: 0.1,
            ease: 'power4.out',
          },
          '-=0.18',
        )
        .fromTo(
          '[data-hero-description]',
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.58 },
          '-=0.23',
        )
        .fromTo(
          '[data-hero-cta]',
          { autoAlpha: 0, y: 10, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
          },
          '-=0.2',
        )
        .fromTo(
          '[data-hero-note]',
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.42 },
          '-=0.16',
        );

      gsap.to('[data-hero-aura]', {
        scale: 1.12,
        opacity: 0.66,
        duration: 11,
        delay: 1.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('[data-hero-particle]', {
        y: 'random(-24, 24)',
        x: 'random(-9, 9)',
        duration: 10,
        delay: 1.6,
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.42, from: 'random' },
        ease: 'sine.inOut',
      });

    }, this.host);
  }
}
