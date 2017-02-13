import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { ElasticModule } from 'angular2-elastic';

import { AppComponent } from './app.component';
import { HomePage } from '../pages/home/home';
import { DreamDetailPage } from '../pages/dream-detail/dream-detail';
import { DreamFormPage } from '../pages/dream-form/dream-form';
import { DreamPopoverPage } from '../pages/dream-popover/dream-popover';
import { DreamService } from './dream.service';

@NgModule({
    declarations: [
        AppComponent,
        HomePage,
        DreamDetailPage,
        DreamFormPage,
        DreamPopoverPage
    ],
    imports: [
        IonicModule.forRoot(AppComponent),
        ElasticModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        AppComponent,
        HomePage,
        DreamDetailPage,
        DreamFormPage,
        DreamPopoverPage
    ],
    providers: [
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        DreamService
    ]
})
export class AppModule { }
