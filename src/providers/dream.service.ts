import { Injectable } from '@angular/core';

import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';
import * as PouchDBUpsert from 'pouchdb-upsert';
import * as loremIpsum from 'lorem-ipsum';
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

        // this.seedTestData(500);
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
     * Gets all dreams ordered by date (most recent first).
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

    /**
     * Generates a random date between the given dates.
     * 
     * @private
     * @param {Date} start 
     * @param {Date} end 
     * @returns {Date} 
     * 
     * @memberof DreamService
     */
    private randomDate(start: Date, end: Date): Date {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }

    /**
     * Generates a random integer between the specified values.
     * 
     * @private
     * @param {number} min 
     * @param {number} max 
     * @returns {number} 
     * 
     * @memberof DreamService
     */
    private randomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    /**
     * Adds test dreams to the database.
     * 
     * @param {number} count - The number of dreams to add.
     * 
     * @memberof DreamService
     */
    private seedTestData(count: number) {
        let dreams = [];

        for (let i = 0; i < count; i++) {
            let dream = new Dream();

            // Random date between 2015 and now
            dream.date = moment(this.randomDate(new Date(2015, 0, 1), new Date())).format('YYYY-MM-DD');
            dream.created = dream.date;

            // Random title and description
            dream.title = loremIpsum({ count: this.randomInt(1, 7), units: 'words' });
            dream.description = loremIpsum({ count: this.randomInt(1, 21) });

            // Random dreamsigns selected from the words in the description
            let descriptionWords = dream.description.split(' ');
            dream.dreamsigns = [];
            for (let i = 0; i < this.randomInt(1, 11); i++) {
                dream.dreamsigns.push(descriptionWords[this.randomInt(0, descriptionWords.length)]);
            }

            dreams.push(dream);
        }

        this.db.bulkDocs(dreams);
    }
}
