import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import * as moment from 'moment';

import { Dream } from '../../providers/dream';
import { DreamService } from '../../providers/dream.service';

/**
 * Displays a form for creating or editing a dream.
 * 
 * @export
 * @class DreamFormPage
 */
@Component({
    selector: 'page-dream-form',
    templateUrl: 'dream-form.html'
})
export class DreamFormPage {
    /**
     * The dream currently being created or edited.
     * 
     * @type {Dream}
     * @memberof DreamFormPage
     */
    dream: Dream;

    /**
     * The ID of the dream being edited.
     * 
     * @private
     * @type {string}
     * @memberof DreamFormPage
     */
    private id: string;

    /**
     * Creates an instance of DreamFormPage.
     * 
     * @param {AlertController} alertCtrl
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {DreamService} dreamService
     * 
     * @memberof DreamFormPage
     */
    constructor(
        private alertCtrl: AlertController,
        private navCtrl: NavController,
        private navParams: NavParams,
        private dreamService: DreamService) {
    }

    /**
     * Gets the dream to create or edit.
     * 
     * 
     * @memberof DreamFormPage
     */
    ionViewWillEnter() {
        this.id = this.navParams.get('id');
        if (this.id) {
            // Existing dream
            this.dreamService.get(this.id)
                .then(dream => this.dream = dream);
        } else {
            // New dream with date set to current day
            this.dream = new Dream();
            this.dream.date = moment().toISOString();
        }
    }

    /**
     * Creates or updates the current dream.
     * 
     * 
     * @memberof DreamFormPage
     */
    save() {
        // Ensure all required fields have been completed
        if (this.dream.date && this.dream.title && this.dream.description) {
            if (this.id) {
                this.dreamService.update(this.dream)
                    .then(dream => this.navCtrl.pop());
            } else {
                this.dreamService.create(this.dream)
                    .then(dream => this.navCtrl.pop());
            }
        } else {
            let alert = this.alertCtrl.create({
                message: 'Please fill out all of the fields.',
                buttons: ['Dismiss']
            });
            alert.present();
        }
    }
}
