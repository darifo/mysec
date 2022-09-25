
import { app } from 'electron'
import path from 'path'

const Datastore = require('nedb')

export const dbPathUser = path.join(app.getPath('userData'), 'mysec_user.db')
export const dbUser = new Datastore({
  autoload: true,
  filename: dbPathUser,
})

export const dbPathData = path.join(app.getPath('userData'), 'mysec_data.db')
export const dbData = new Datastore({
  autoload: true,
  filename: dbPathData,
})