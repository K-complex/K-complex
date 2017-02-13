import { Component } from '@angular/core';
import { AlertController, NavController, NavParams, PopoverController } from 'ionic-angular';

import { Dream } from '../../app/dream';
import { DreamFormPage } from '../dream-form/dream-form';
import { DreamPopoverPage } from '../dream-popover/dream-popover';
import { DreamService } from '../../app/dream.service';

@Component({
    selector: 'page-dream-detail',
    templateUrl: 'dream-detail.html'
})
export class DreamDetailPage {
    private dream: Dream = new Dream();
    private id: string;

    constructor(
        private alertCtrl: AlertController,
        private navCtrl: NavController,
        private navParams: NavParams,
        private popoverCtrl: PopoverController,
        private dreamService: DreamService) {
    }

    ionViewWillEnter() {
        this.id = this.navParams.get('id');
        this.dreamService.get(this.id)
            .then(dream => this.dream = dream);
    }

    goToDreamForm() {
        this.navCtrl.push(DreamFormPage, { id: this.id });
    }

    presentPopover(event) {
        let popover = this.popoverCtrl.create(DreamPopoverPage);

        popover.onDidDismiss(action => {
            if (action === 'delete') {
                this.dreamService.delete(this.dream._id, this.dream._rev)
                    .then(() => this.navCtrl.pop());
            }
        });

        popover.present({ ev: event });
    }
}
