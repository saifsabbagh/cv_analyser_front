import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, PublicNavbarComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit, OnDestroy {
  @ViewChild('statsSection', { static: true }) statsSection!: ElementRef;

  cvsAnalyzed = '0+';
  extractionPrecision = '0%';
  avgAnalysisTime = '0min';

  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;

  ngOnInit() {
    this.setupIntersectionObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.hasAnimated = true;
          this.startAnimations();
        }
      });
    }, { threshold: 0.1 });

    if (this.statsSection) {
      this.observer.observe(this.statsSection.nativeElement);
    }
  }

  private startAnimations() {
    this.animateCountUp(500, '+', (val) => this.cvsAnalyzed = val);
    this.animateCountUp(98, '%', (val) => this.extractionPrecision = val);
    this.animateCountUp(2, 'min', (val) => this.avgAnalysisTime = val);
  }

  private animateCountUp(target: number, suffix: string, updateFn: (val: string) => void, duration = 2000) {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * target);
      updateFn(`${currentValue}${suffix}`);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        updateFn(`${target}${suffix}`);
      }
    };
    window.requestAnimationFrame(step);
  }
}
