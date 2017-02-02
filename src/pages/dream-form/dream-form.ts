import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import * as moment from 'moment';

import { Dream } from '../../app/dream';
import { DreamService } from '../../app/dream.service';

@Component({
    selector: 'page-dream-form',
    templateUrl: 'dream-form.html'
})
export class DreamFormPage {
    private dream: Dream = new Dream();
    private id: string;

    constructor(
        private alertCtrl: AlertController,
        private navCtrl: NavController,
        private navParams: NavParams,
        private dreamService: DreamService) {
    }

    ionViewWillEnter() {
        this.id = this.navParams.get('id');
        if (this.id) {
            this.dreamService.get(this.id)
                .then(dream => this.dream = dream);
        } else {
            this.dream.date = moment().startOf('minute').format();
        }
    }

    save() {
        if (!this.dream.date || !this.dream.title || !this.dream.description) {
            let alert = this.alertCtrl.create({
                message: 'Please fill out all of the fields.',
                buttons: ['Dismiss']
            });
            alert.present();
            return;
        }

        if (this.id) {
            this.dreamService.update(this.dream)
                .then(dream => this.navCtrl.pop());
        } else {
            this.dreamService.create(this.dream)
                .then(dream => this.navCtrl.pop());
        }
    }
}
