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
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { ServicesComponent } from './components/services/services.component';
import { ContactComponent } from './components/contact/contact.component';
import { FooterComponent } from './components/footer/footer.component';
import { SiteOpeningComponent } from './components/site-opening/site-opening.component';

type RevertibleAnimationContext = { revert(): void };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    SiteOpeningComponent,
    HeaderComponent,
    HeroComponent,
    ServicesComponent,
    ContactComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements AfterViewInit, OnDestroy {
  private readonly host: HTMLElement;
  private animationContext?: RevertibleAnimationContext;
  private lenis?: import('lenis').default;
  private gsapRuntime?: typeof import('gsap').gsap;
  private scrollTriggerRuntime?: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  private stopLenisListening?: () => void;
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

    window.requestAnimationFrame(() => window.dispatchEvent(new Event('nwl-app-ready')));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.motionTimer = window.setTimeout(() => void this.startMotion(), 180);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.motionTimer) window.clearTimeout(this.motionTimer);
    this.clearMotion();
  }

  private async startMotion(): Promise<void> {
    let gsapModule: typeof import('gsap');
    let scrollTriggerModule: typeof import('gsap/ScrollTrigger');
    let lenisModule: typeof import('lenis');
    try {
      [gsapModule, scrollTriggerModule, lenisModule] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('lenis'),
      ]);
    } catch {
      return;
    }

    if (this.destroyed) return;

    const gsap = gsapModule.gsap;
    const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
    this.gsapRuntime = gsap;
    this.scrollTriggerRuntime = ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    const Lenis = lenisModule.default;
    this.lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      smoothWheel: true,
      lerp: 0.085,
    });
    this.stopLenisListening = this.lenis.on('scroll', this.onLenisScroll);
    gsap.ticker.add(this.onGsapTick);
    gsap.ticker.lagSmoothing(0);

    this.animationContext = gsap.context(() => {
      const revealTargets = this.host.querySelectorAll<HTMLElement>('[data-scroll-reveal]');
      revealTargets.forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 44, rotationX: 4 },
          {
            autoAlpha: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top 90%',
              end: 'top 56%',
              scrub: 0.9,
            },
          },
        );
      });

      const cardGrid = this.host.querySelector<HTMLElement>('[data-card-stagger]');
      const cards = cardGrid?.querySelectorAll<HTMLElement>('.service');
      if (cardGrid && cards?.length) {
        gsap.fromTo(
          cards,
          { autoAlpha: 0, y: 58, rotationX: 8, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            rotationX: 0,
            scale: 1,
            duration: 1,
            stagger: 0.14,
            ease: 'none',
            scrollTrigger: {
              trigger: cardGrid,
              start: 'top 90%',
              end: 'top 54%',
              scrub: 1,
            },
          },
        );
      }

      const processList = this.host.querySelector<HTMLElement>('[data-process-stagger]');
      const processSteps = processList?.querySelectorAll<HTMLElement>('.process-step');
      if (processList && processSteps?.length) {
        gsap.fromTo(
          processSteps,
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'none',
            scrollTrigger: {
              trigger: processList,
              start: 'top 90%',
              end: 'top 56%',
              scrub: 0.9,
            },
          },
        );
      }

      const contactList = this.host.querySelector<HTMLElement>('[data-contact-stagger]');
      const contactRows = contactList?.querySelectorAll<HTMLElement>('[data-contact-link]');
      if (contactList && contactRows?.length) {
        gsap.fromTo(
          contactRows,
          { autoAlpha: 0, x: 42 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 1,
            stagger: 0.18,
            ease: 'none',
            scrollTrigger: {
              trigger: contactList,
              start: 'top 88%',
              end: 'top 54%',
              scrub: 0.95,
            },
          },
        );
      }

      const navLinks = this.host.querySelectorAll<HTMLAnchorElement>(
        '.header nav a[href^="#"]',
      );
      navLinks.forEach((link) => {
        const section = this.host.querySelector<HTMLElement>(link.hash);
        if (!section) return;

        ScrollTrigger.create({
          trigger: section,
          start: 'top 48%',
          end: 'bottom 48%',
          onToggle: ({ isActive }) => {
            if (isActive) {
              link.setAttribute('aria-current', 'location');
            } else if (link.getAttribute('aria-current') === 'location') {
              link.removeAttribute('aria-current');
            }
          },
        });
      });
    }, this.host);

    ScrollTrigger.refresh();
  }

  private onGsapTick = (timeInSeconds: number): void => {
    this.lenis?.raf(timeInSeconds * 1000);
  };

  private onLenisScroll = (): void => {
    this.scrollTriggerRuntime?.update();
  };

  private clearMotion(): void {
    this.animationContext?.revert();
    this.animationContext = undefined;

    if (this.lenis) {
      this.gsapRuntime?.ticker.remove(this.onGsapTick);
      this.stopLenisListening?.();
      this.stopLenisListening = undefined;
      this.lenis.destroy();
      this.lenis = undefined;
      this.gsapRuntime?.ticker.lagSmoothing(500, 33);
    }
  }
}
