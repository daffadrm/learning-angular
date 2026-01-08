import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient } from '@angular/common/http';
import { definePreset } from '@primeng/themes';
import { ConfirmationService, MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    providePrimeNG({
      theme: {
        preset: definePreset(Aura, {
          semantic: {
            primary: {
              50: '#FFF3EB',
              100: '#FFE0CC',
              200: '#FFC299',
              300: '#FFA366',
              400: '#FF8533',
              500: '#FF6600',
              600: '#E65C00',
              700: '#CC5200',
              800: '#B34700',
              900: '#993D00',
              950: '#662900',
            },
          },
        }),

        options: {
          darkModeSelector: false || 'none',
        },
      },
    }),
    ConfirmationService,
    MessageService,
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: {
        baseUrl: 'assets/monaco/vs',
        defaultOptions: {
          automaticLayout: true,
          scrollBeyondLastLine: false,
        },
      },
    },
  ],
};
