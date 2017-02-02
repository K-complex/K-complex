import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Dream } from '../../app/dream';
import { DreamService } from '../../app/dream.service';
import { DreamFormPage } from '../dream-form/dream-form';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private dreams: Dream[] = [];

    constructor(
        private navCtrl: NavController,
        private dreamService: DreamService) {
    }

    ionViewWillEnter() {
        this.dreamService.getAll()
            .then(dreams => this.dreams = dreams);
    }

    goToDreamForm(id?: string) {
        this.navCtrl.push(DreamFormPage, { id: id });
    }
}
