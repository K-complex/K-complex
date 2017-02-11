import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { AppComponent } from './app.component';
import { HomePage } from '../pages/home/home';
import { DreamFormPage } from '../pages/dream-form/dream-form';
import { DreamService } from './dream.service';

@NgModule({
    declarations: [
        AppComponent,
        HomePage,
        DreamFormPage
    ],
    imports: [
        IonicModule.forRoot(AppComponent)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        AppComponent,
        HomePage,
        DreamFormPage
    ],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        DreamService
    ]
})
export class AppModule { }
