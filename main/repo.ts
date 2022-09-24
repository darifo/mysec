
import { app } from 'electron'
import path from 'path'

const Datastore = require('nedb')
export const dbPath = path.join(app.getPath('userData'), 'mysec_data.db')
export const db = new Datastore({
  autoload: true,
  filename: dbPath,
})
