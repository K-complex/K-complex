import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';

import { Dream } from '../../providers/dream';
import { DreamFormPage } from '../dream-form/dream-form';
import { DreamPopoverPage } from '../dream-popover/dream-popover';
import { DreamService } from '../../providers/dream.service';

/**
 * Page to display dream details.
 * 
 * @export
 * @class DreamDetailPage
 */
@Component({
    selector: 'page-dream-detail',
    templateUrl: 'dream-detail.html'
})
export class DreamDetailPage {
    /**
     * The dream currently being displayed.
     * 
     * @type {Dream}
     * @memberof DreamDetailPage
     */
    dream: Dream;

    /**
     * The ID of the current dream.
     * 
     * @private
     * @type {string}
     * @memberof DreamDetailPage
     */
    private id: string;

    /**
     * Creates an instance of DreamDetailPage.
     * 
     * @param {AlertController} alertCtrl
     * @param {NavController} navCtrl
     * @param {NavParams} navParams
     * @param {PopoverController} popoverCtrl
     * @param {ToastController} toastCtrl
     * @param {DreamService} dreamService
     * 
     * @memberof DreamDetailPage
     */
    constructor(
        private alertCtrl: AlertController,
        private navCtrl: NavController,
        private navParams: NavParams,
        private popoverCtrl: PopoverController,
        private toastCtrl: ToastController,
        private dreamService: DreamService) {
    }

    /**
     * Gets the dream to display.
     * 
     * 
     * @memberof DreamDetailPage
     */
    ionViewWillEnter() {
        this.id = this.navParams.get('id');
        this.dreamService.get(this.id)
            .then(dream => this.dream = dream);
    }

    /**
     * Navigates to the edit form for the current dream.
     * 
     * 
     * @memberof DreamDetailPage
     */
    goToDreamForm() {
        this.navCtrl.push(DreamFormPage, { id: this.id });
    }

    /**
     * Displays the dream popover.
     * 
     * @param {any} event
     * 
     * @memberof DreamDetailPage
     */
    presentPopover(event) {
        let popover = this.popoverCtrl.create(DreamPopoverPage);

        popover.onDidDismiss(action => {
            if (action === 'delete') {
                this.deleteDream();
            }
        });

        popover.present({ ev: event });
    }

    /**
     * Deletes the current dream.
     * 
     * @private
     * 
     * @memberof DreamDetailPage
     */
    private deleteDream() {
        this.dreamService.delete(this.dream._id, this.dream._rev)
            .then(() => {
                this.navCtrl.pop();

                let toast = this.toastCtrl.create({
                    message: 'Dream deleted.',
                    duration: 3000,
                    showCloseButton: true
                });
                toast.present();
            });
    }
}
