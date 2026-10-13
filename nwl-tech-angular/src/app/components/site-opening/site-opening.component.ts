import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { ConnectivitySceneComponent } from '../connectivity-scene/connectivity-scene.component';

@Component({
  selector: 'app-site-opening',
  standalone: true,
  imports: [ConnectivitySceneComponent],
  templateUrl: './site-opening.component.html',
  styleUrl: './site-opening.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteOpeningComponent implements AfterViewInit, OnDestroy {
  protected readonly visible = signal(true);
  protected readonly leaving = signal(false);
  protected readonly animationReady = signal(false);
  protected readonly progress = signal(0);
  private readonly minimumDuration = 4200;
  private minimumTimer = 0;
  private maximumTimer = 0;
  private removeTimer = 0;
  private progressTimer = 0;
  private progressStartedAt = 0;
  private minimumElapsed = false;
  private appReady = false;
  private sceneReady = false;
  private closed = false;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    window.addEventListener('nwl-app-ready', this.handleAppReady);
    this.progressStartedAt = performance.now();
    this.advanceProgress();
    this.progressTimer = window.setInterval(this.advanceProgress, 80);
    this.minimumTimer = window.setTimeout(() => {
      this.minimumElapsed = true;
      this.advanceProgress();
      this.tryClose();
    }, this.minimumDuration);
    this.maximumTimer = window.setTimeout(() => this.close(), 9000);
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    window.removeEventListener('nwl-app-ready', this.handleAppReady);
    window.clearTimeout(this.minimumTimer);
    window.clearTimeout(this.maximumTimer);
    window.clearTimeout(this.removeTimer);
    window.clearInterval(this.progressTimer);
  }

  protected onSceneReady(): void {
    this.sceneReady = true;
    this.animationReady.set(true);
    this.advanceProgress();
    this.tryClose();
  }

  private readonly handleAppReady = (): void => {
    this.appReady = true;
    this.advanceProgress();
    this.tryClose();
  };

  private readonly advanceProgress = (): void => {
    if (this.closed || !this.progressStartedAt) return;

    const elapsed = Math.min(
      (performance.now() - this.progressStartedAt) / this.minimumDuration,
      1,
    );
    const milestones = (this.appReady ? 10 : 0) + (this.sceneReady ? 16 : 0);
    const nextProgress = Math.min(96, Math.round(elapsed * 70 + milestones));
    this.progress.update((current) => Math.max(current, nextProgress));
  };

  private tryClose(): void {
    if (this.minimumElapsed && this.appReady && this.sceneReady) this.close();
  }

  private close(): void {
    if (this.closed) return;
    this.closed = true;
    this.progress.set(100);
    window.clearInterval(this.progressTimer);
    this.progressTimer = 0;
    this.leaving.set(true);
    this.removeTimer = window.setTimeout(() => this.visible.set(false), 960);
  }
}
