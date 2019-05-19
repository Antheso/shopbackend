import * as jwt from 'jwt-simple';
import { config } from "../config";
import { mysqlConnection } from '../db/db';

export function isAdmin(req, res, callback) {
  if (!req.headers[config.jwtCookieKey]) {
      return res.sendStatus(401);
  }

  let login = '';

  try {
    login = jwt.decode(<any>req.headers[config.jwtCookieKey], config.secretKey).login;
  } catch (err) {
    return res.sendStatus(401);
  }

  mysqlConnection.query('select is_admin as isAdmin from users where login = ?;', login, (err, rows) => {
    if (!err) {
      if (!rows[0].isAdmin) {
        return res.sendStatus(403);
      }

      callback();
    } else {
      return res.sendStatus(500);
    }
  });

}
