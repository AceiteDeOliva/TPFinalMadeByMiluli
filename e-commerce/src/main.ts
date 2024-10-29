import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; 
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const appConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
  ],
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));