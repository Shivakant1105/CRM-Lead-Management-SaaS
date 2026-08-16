import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY = 'flowcrm_theme_preference';
  activeTheme = signal<ThemeMode>('system');
  effectiveTheme = signal<'light' | 'dark'>('light');

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY) as ThemeMode | null;
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      this.setTheme(saved);
    } else {
      this.setTheme('system');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.activeTheme() === 'system') {
        this.applyEffectiveTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(mode: ThemeMode): void {
    this.activeTheme.set(mode);
    localStorage.setItem(this.STORAGE_KEY, mode);

    if (mode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applyEffectiveTheme(prefersDark ? 'dark' : 'light');
    } else {
      this.applyEffectiveTheme(mode);
    }
  }

  private applyEffectiveTheme(theme: 'light' | 'dark'): void {
    this.effectiveTheme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
