import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

import { Dream } from '../../providers/dream';
import { DreamDetailPage } from '../dream-detail/dream-detail';
import { DreamFormPage } from '../dream-form/dream-form';
import { DreamService } from '../../providers/dream.service';

/**
 * Page to display a list of dreams.
 * 
 * @export
 * @class HomePage
 */
@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    /**
     * The dreams currently being displayed.
     * 
     * @type {Dream[]}
     * @memberof HomePage
     */
    dreams: Dream[] = [];

    /**
     * Flag to indicate when dreams have been loaded.
     * 
     * 
     * @memberof HomePage
     */
    dreamsLoaded = false;

    /**
     * Creates an instance of HomePage.
     * 
     * @param {NavController} navCtrl
     * @param {DreamService} dreamService
     * 
     * @memberof HomePage
     */
    constructor(
        private loadingCtrl: LoadingController,
        private navCtrl: NavController,
        private dreamService: DreamService) {
    }

    /**
     * Gets the dreams to display.
     * 
     * 
     * @memberof HomePage
     */
    ionViewWillEnter() {
        let loader = this.loadingCtrl.create({
            content: "Loading dreams..."
        });
        loader.present();

        this.dreamService.getAll()
            .then(dreams => {
                this.dreams = dreams;
                this.dreamsLoaded = true;
                loader.dismiss();
            });
    }

    /**
     * Navigates to the dream form.
     * 
     * 
     * @memberof HomePage
     */
    goToDreamForm() {
        this.navCtrl.push(DreamFormPage);
    }

    /**
     * Navigates to the dream detail page.
     * 
     * @param {string} id - A dream ID.
     * 
     * @memberof HomePage
     */
    goToDreamDetail(id: string) {
        this.navCtrl.push(DreamDetailPage, { id: id });
    }
}
