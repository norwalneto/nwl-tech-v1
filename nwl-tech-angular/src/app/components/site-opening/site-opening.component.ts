import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-site-opening',
  standalone: true,
  templateUrl: './site-opening.component.html',
  styleUrl: './site-opening.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteOpeningComponent implements AfterViewInit, OnDestroy {
  protected readonly visible = signal(true);
  protected readonly leaving = signal(false);
  protected readonly logoReady = signal(false);
  @ViewChild('brandLogo') private brandLogo?: ElementRef<HTMLImageElement>;
  private minimumTimer = 0;
  private maximumTimer = 0;
  private removeTimer = 0;
  private minimumElapsed = false;
  private appReady = false;
  private sceneReady = false;
  private closed = false;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.brandLogo?.nativeElement.complete) this.onLogoReady();

    window.addEventListener('nwl-app-ready', this.handleAppReady);
    window.addEventListener('nwl-scene-ready', this.handleSceneReady);
    this.minimumTimer = window.setTimeout(() => {
      this.minimumElapsed = true;
      this.tryClose();
    }, 4200);
    this.maximumTimer = window.setTimeout(() => this.close(), 9000);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    window.removeEventListener('nwl-app-ready', this.handleAppReady);
    window.removeEventListener('nwl-scene-ready', this.handleSceneReady);
    window.clearTimeout(this.minimumTimer);
    window.clearTimeout(this.maximumTimer);
    window.clearTimeout(this.removeTimer);
  }

  protected onLogoReady(): void {
    const image = this.brandLogo?.nativeElement;
    if (!image) {
      this.logoReady.set(true);
      return;
    }

    void image.decode()
      .catch(() => undefined)
      .finally(() => this.logoReady.set(true));
  }

  private readonly handleAppReady = (): void => {
    this.appReady = true;
    this.tryClose();
  };

  private readonly handleSceneReady = (): void => {
    this.sceneReady = true;
    this.tryClose();
  };

  private tryClose(): void {
    if (this.minimumElapsed && this.appReady && this.sceneReady) this.close();
  }

  private close(): void {
    if (this.closed) return;
    this.closed = true;
    this.leaving.set(true);
    this.removeTimer = window.setTimeout(() => this.visible.set(false), 960);
  }
}
