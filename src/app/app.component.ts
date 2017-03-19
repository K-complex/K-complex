import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';

import { AnalysisPage } from '../pages/analysis/analysis';
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
     * Reference to the nav element.
     * 
     * @type {Nav}
     * @memberof AppComponent
     */
    @ViewChild(Nav)
    nav: Nav;

    /**
     * App menu items.
     * 
     * @type {Array<{ title: string, component: any, icon: string }>}
     * @memberof AppComponent
     */
    pages: Array<{ title: string, component: any, icon: string }>;

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

        this.pages = [
            { title: 'Journal', component: HomePage, icon: 'calendar' },
            { title: 'Analysis', component: AnalysisPage, icon: 'pulse' }
        ];
    }

    /**
     * Navigates to a page.
     * 
     * @param {any} page 
     * 
     * @memberof AppComponent
     */
    openPage(page) {
        this.nav.setRoot(page.component);
    }
}
