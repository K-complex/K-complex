import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

/**
 * Page to display additional dream actions.
 * 
 * @export
 * @class DreamPopoverPage
 */
@Component({
    selector: 'page-dream-popover',
    templateUrl: 'dream-popover.html'
})
export class DreamPopoverPage {
    /**
     * Creates an instance of DreamPopoverPage.
     * 
     * @param {ViewController} viewCtrl
     * 
     * @memberof DreamPopoverPage
     */
    constructor(private viewCtrl: ViewController) {
    }

    /**
     * Dismisses the popover.
     * 
     * @param {*} data - Optional data to pass to the `onDidDismiss` callback.
     * 
     * @memberof DreamPopoverPage
     */
    dismiss(data: any) {
        this.viewCtrl.dismiss(data);
    }
}
