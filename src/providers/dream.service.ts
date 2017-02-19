import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
import * as moment from 'moment';

import { Dream } from './dream';

/**
 * Implements CRUD operations on dreams.
 * 
 * @export
 * @class DreamService
 */
@Injectable()
export class DreamService {
    /**
     * The dream database.
     * 
     * @private
     * @type {PouchDB.Database<{}>}
     * @memberof DreamService
     */
    private db: PouchDB.Database<{}>;

    /**
     * Date field index.
     * 
     * @private
     * @type {PouchDB.Find.CreateIndexOptions}
     * @memberof DreamService
     */
    private dateIndex: PouchDB.Find.CreateIndexOptions = {
        index: {
            fields: ['date', 'created']
        }
    };

    /**
     * Dream date storage format.
     * 
     * @private
     * 
     * @memberof DreamService
     */
    private dateFormat = 'YYYY-MM-DD';

    /**
     * Creates an instance of DreamService.
     * 
     * 
     * @memberof DreamService
     */
    constructor() {
        PouchDB.plugin(PouchDBFind);
        this.db = new PouchDB('dreams');
    }

    /**
     * Creates a dream.
     * 
     * @param {Dream} dream
     * @returns {Promise<Dream>}
     * 
     * @memberof DreamService
     */
    create(dream: Dream): Promise<Dream> {
        dream.created = moment().format();
        dream.date = moment(dream.date).format(this.dateFormat);
        return this.db.post(dream)
            .then(response => this.db.get(response.id))
            .catch(this.handleError);
    }

    /**
     * Deletes a dream.
     * 
     * @param {string} id
     * @param {string} rev
     * @returns {Promise<any>}
     * 
     * @memberof DreamService
     */
    delete(id: string, rev: string): Promise<any> {
        return this.db.remove(id, rev)
            .catch(this.handleError);
    }

    /**
     * Gets a dream.
     * 
     * @param {string} id
     * @returns {Promise<Dream>}
     * 
     * @memberof DreamService
     */
    get(id: string): Promise<Dream> {
        return this.db.get(id)
            .catch(this.handleError);
    }

    /**
     * Gets all dreams.
     * 
     * @returns {Promise<Dream[]>}
     * 
     * @memberof DreamService
     */
    getAll(): Promise<Dream[]> {
        return new Promise<Dream[]>((resolve, reject) => {
            this.db.createIndex(this.dateIndex)
                .then(response => {
                    let request: any = {
                        selector: { date: { $gt: null }, created: { $gt: null } },
                        sort: [{ date: 'desc' }, { created: 'desc' }]
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

    /**
     * Updates a dream.
     * 
     * @param {Dream} dream
     * @returns {Promise<Dream>}
     * 
     * @memberof DreamService
     */
    update(dream: Dream): Promise<Dream> {
        dream.date = moment(dream.date).format(this.dateFormat);
        return this.db.put(dream)
            .then(response => this.db.get(response.id))
            .catch(this.handleError);
    }

    /**
     * Logs errors.
     * 
     * @private
     * @param {*} error
     * @returns {Promise<any>}
     * 
     * @memberof DreamService
     */
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
