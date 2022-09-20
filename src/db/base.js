import Datastore from 'nedb';
import path from 'path';
import { remote } from 'electron';
import fs from 'fs';

export default function (dbName) {
    const fPath = path.join(remote.app.getPath('userData'), dbName + '.db');
    fs.appendFileSync(fPath, "", function (err, file) {
        console.log(err, file);
    });
    return new Datastore({
        autoload: true,
        filename: fPath
    });
}