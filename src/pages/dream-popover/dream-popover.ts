import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
    selector: 'page-dream-popover',
    templateUrl: 'dream-popover.html'
})
export class DreamPopoverPage {
    constructor(private viewCtrl: ViewController) {
    }

    delete() {
        this.viewCtrl.dismiss('delete');
    }
}
