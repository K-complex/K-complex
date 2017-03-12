/**
 * Represents a dream.
 * 
 * @export
 * @class Dream
 */
export class Dream {
    _id: string;
    _rev: string;
    created: string;
    date: string;
    title: string;
    description: string;
    dreamsigns: Array<string>;
}
