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
  private revealObserver?: IntersectionObserver;
  private readonly revealTargets: HTMLElement[] = [];
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
    this.initializeScrollReveals();

    this.motionTimer = window.setTimeout(() => void this.startMotion(), 180);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.motionTimer) window.clearTimeout(this.motionTimer);
    this.revealObserver?.disconnect();
    this.revealTargets.forEach((element) => {
      element.classList.remove('scroll-reveal', 'scroll-reveal--visible');
      element.style.removeProperty('--scroll-reveal-delay');
    });
    this.revealTargets.length = 0;
    this.clearMotion();
  }

  private initializeScrollReveals(): void {
    const groups = [
      { selector: '[data-scroll-reveal]', stagger: 0 },
      { selector: '[data-card-stagger] .service', stagger: 80 },
      { selector: '[data-process-stagger] .process-step', stagger: 90 },
      { selector: '[data-contact-stagger] [data-contact-link]', stagger: 100 },
    ];

    groups.forEach(({ selector, stagger }) => {
      this.host.querySelectorAll<HTMLElement>(selector).forEach((element, index) => {
        element.classList.add('scroll-reveal');
        element.style.setProperty('--scroll-reveal-delay', `${index * stagger}ms`);
        this.revealTargets.push(element);
      });
    });

    if (typeof IntersectionObserver === 'undefined') {
      this.revealTargets.forEach((element) => element.classList.add('scroll-reveal--visible'));
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;
          element.classList.add('scroll-reveal--visible');
          this.revealObserver?.unobserve(element);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    this.revealTargets.forEach((element) => this.revealObserver?.observe(element));
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
    } catch (error) {
      console.error('Não foi possível carregar as animações de rolagem:', error);
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
