import { Component } from '@angular/core';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import { Dream } from '../../app/dream';
import { DreamFormPage } from '../dream-form/dream-form';
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
        private dreamService: DreamService) {
    }

    ionViewWillEnter() {
        this.id = this.navParams.get('id');
        this.dreamService.get(this.id)
            .then(dream => this.dream = dream);
    }

    edit() {
        this.navCtrl.push(DreamFormPage, { id: this.id });
    }
}
