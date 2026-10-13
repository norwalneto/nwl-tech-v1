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
  private destroyed = false;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private readonly platformId: object,
  ) {
    this.host = this.elementRef.nativeElement;
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    window.requestAnimationFrame(() => {
      this.motionTimer = window.setTimeout(() => void this.startMotion(), 180);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.motionTimer) window.clearTimeout(this.motionTimer);
    this.animationContext?.revert();
  }

  private async startMotion(): Promise<void> {
    let gsapModule: typeof import('gsap');
    let scrollTriggerModule: typeof import('gsap/ScrollTrigger');
    try {
      [gsapModule, scrollTriggerModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);
    } catch {
      return;
    }

    if (this.destroyed) return;

    const gsap = gsapModule.gsap;
    const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

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

      gsap.to('[data-hero-aura]', {
        yPercent: -22,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }, this.host);
  }
}
