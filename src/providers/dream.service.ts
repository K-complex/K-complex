import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
import * as PouchDBUpsert from 'pouchdb-upsert';
import * as moment from 'moment';

import { Dream } from './dream';

// Map/reduce emit() function
declare var emit: any;

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
     * Index of dreamsigns and counts across all dreams.
     * 
     * @private
     * @type {*}
     * @memberof DreamService
     */
    private dreamsignIndex: any = {
        _id: '_design/dreamsigns',
        version: 2,
        views: {
            dreamsigns: {
                map: ((dream: Dream) => {
                    for (let sign of dream.dreamsigns) {
                        emit(sign);
                    }
                }).toString(),
                reduce: '_count'
            }
        }
    };

    /**
     * Creates an instance of DreamService.
     * 
     * 
     * @memberof DreamService
     */
    constructor() {
        PouchDB.plugin(PouchDBFind);
        PouchDB.plugin(PouchDBUpsert);
        this.db = new PouchDB('dreams');

        // Update or insert dreamsign index
        this.db.upsert(this.dreamsignIndex._id, (doc: any) => {
            if (doc.version === this.dreamsignIndex.version) {
                // No update required
                return false;
            }

            return Object.assign(doc, this.dreamsignIndex);
        });
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
     * Gets dreamsigns along with their counts, highest to lowest.
     * 
     * @param {number} [limit] - Optional number of signs to return.
     * @returns {Promise<{ dreamsign: string, count: number }[]>} 
     * 
     * @memberof DreamService
     */
    getDreamsignCounts(limit?: number): Promise<{ dreamsign: string, count: number }[]> {
        let options = {
            group: true,
            limit: limit
        };

        return this.db.query('dreamsigns', options)
            .then(response => response.rows.sort((a, b) => b.value - a.value).map(r => {
                return {
                    dreamsign: r.key,
                    count: r.value
                };
            }))
            .catch(this.handleError);
    }

    /**
     * Gets unique dreamsigns with a given prefix.
     * 
     * @param {string} prefix - The prefix string.
     * @param {number} limit - The number of signs to return.
     * @returns {Promise<string[]>} 
     * 
     * @memberof DreamService
     */
    getDreamsigns(prefix: string, limit: number): Promise<string[]> {
        let options = {
            startkey: prefix,
            endkey: prefix + '\uffff',
            limit: limit,
            group: true
        };

        return this.db.query('dreamsigns', options)
            .then(response => response.rows.map(r => r.key))
            .catch(this.handleError);
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
