import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { webcomponentsReady } from './origami/origami';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

webcomponentsReady().then(() => {
  platformBrowserDynamic().bootstrapModule(AppModule);
}).catch(error => {
  console.error(error);
});