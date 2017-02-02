import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

import { Dream } from './dream';

@Injectable()
export class DreamService {
    private db: PouchDB.Database<{}>;
    private dateIndex = {
        index: {
            fields: ['date']
        }
    };

    constructor() {
        this.db = new PouchDB('dreams');
    }

    create(dream: Dream): Promise<Dream> {
        return this.db.post(dream)
            .then(response => this.db.get(response.id))
            .catch(this.handleError);
    }

    get(id: string): Promise<Dream> {
        return this.db.get(id)
            .catch(this.handleError);
    }

    getAll(): Promise<Dream[]> {
        return new Promise<Dream[]>((resolve, reject) => {
            this.db.createIndex(this.dateIndex)
                .then(response => {
                    let request: any = {
                        selector: { date: { $gt: null } },
                        sort: [{ date: 'desc' }]
                    };

                    this.db.find(request)
                        .then(response => {
                            let dreams = response.docs.map(d => d as Dream);
                            resolve(dreams);
                        })
                        .catch(this.handleError);
                })
                .catch(this.handleError);
        });
    }

    update(dream: Dream): Promise<Dream> {
        return this.db.put(dream)
            .then(response => this.db.get(response.id))
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
