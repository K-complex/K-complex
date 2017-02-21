import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';

import { HomePage } from '../pages/home/home';

/**
 * Root component.
 * 
 * @export
 * @class AppComponent
 */
@Component({
    templateUrl: 'app.html'
})
export class AppComponent {
    /**
     * Root page.
     * 
     * 
     * @memberof AppComponent
     */
    rootPage = HomePage;

    /**
     * Creates an instance of AppComponent.
     * 
     * @param {Platform} platform
     * 
     * @memberof AppComponent
     */
    constructor(platform: Platform) {
        platform.ready().then(() => {
            Splashscreen.hide();
            StatusBar.hide();
        });
    }
}
