import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { DreamService } from '../../providers/dream.service';

/**
 * Displays dream statistics.
 * 
 * @export
 * @class AnalysisPage
 */
@Component({
    selector: 'page-analysis',
    templateUrl: 'analysis.html'
})
export class AnalysisPage {
    /**
     * An array of objects containing dreamsigns and their counts.
     * 
     * @type {{ dreamsign: string, count: number }[]}
     * @memberof AnalysisPage
     */
    dreamsignCounts: { dreamsign: string, count: number }[];

    /**
     * The total number of journal entries.
     * 
     * @type {number}
     * @memberof AnalysisPage
     */
    totalDreams: number;

    /**
     * Creates an instance of AnalysisPage.
     *
     * @param {NavController} navCtrl 
     * @param {NavParams} navParams 
     * @param {DreamService} dreamService 
     * 
     * @memberof AnalysisPage
     */
    constructor(
        private navCtrl: NavController,
        private navParams: NavParams,
        private dreamService: DreamService) {
    }

    /**
     * Gets the statistics to display.
     * 
     * 
     * @memberof AnalysisPage
     */
    ionViewWillEnter() {
        this.dreamService.getAll().then(dreams => this.totalDreams = dreams.length);
        this.dreamService.getDreamsignCounts()
            .then(dreamsignCounts => this.dreamsignCounts = dreamsignCounts);
    }
}
