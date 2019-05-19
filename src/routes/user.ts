import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jwt-simple';
import { mysqlConnection } from '../db/db';
import { config } from '../config';
import { isAdmin } from '../middlewares/admin';

export const router = express.Router();

class User {
  login: string;
  password: string;
  name?: string;
  surname?: string;
  is_admin?: number;
}

router.post('/user', (req, res) => {
  const user = new User(),
    password = req.body.password;

  user.login = req.body.login;
  user.name = req.body.name || '';
  user.surname = req.body.surname || '';
  user.is_admin = 0;

  bcrypt.hash(password, 10, function(err, hash){
    if (err) {
      res.sendStatus(500);
    } else {
        user.password = hash;
        mysqlConnection.query('insert into users set ?;', user, (err) => {
          if (!err) {
            res.send({
              success: true
            });
          } else {
            console.log(err);
            res.sendStatus(500);
          }
        });
    }
  });
});

router.get('/user', function (req, res) {
  if (!req.headers[config.jwtCookieKey]) {
      return res.sendStatus(401);
  }

  try {
    var auth = jwt.decode(<any>req.headers[config.jwtCookieKey], config.secretKey);
  } catch (err) {
    return res.sendStatus(401);
  }

  mysqlConnection.query('select login, name, surname, is_admin as isAdmin from users where login = ?;', auth.login, (err, rows) => {
    if (!err) {
      res.send({
        success: true,
        data: {
          login: rows[0].login,
          name: rows[0].name,
          surname: rows[0].surname,
          isAdmin: !!rows[0].isAdmin
        }
      });
    } else {
      console.log(err);
      res.sendStatus(500);
    }
  });
});

router.get('/users', function(req, res) {
  isAdmin(req, res, function() {
    mysqlConnection.query('select login, name, surname, is_admin as isAdmin from users;', (err, rows) => {
      if (!err) {
        res.send({
          success: true,
          data: rows
        });
      } else {
        console.log(err);
        res.sendStatus(500);
      }
    });
  });
});

router.delete('/users/:login', function(req, res) {
  isAdmin(req, res, function() {
    mysqlConnection.query('delete from users where login = ?;', req.params.login, (err) => {
      if (!err) {
        res.send({
          success: true
        });
      } else {
        console.log(err);
        res.sendStatus(500);
      }
    });
  });
});

router.patch('/users/:login', function(req, res) {
  isAdmin(req, res, function() {
    const user = req.body,
      query = 'update users set name = ?, surname = ?, is_admin = ? where login = ?;';
    mysqlConnection.query(query, [user.name, user.surname, +user.isAdmin, req.params.login], (err) => {
      if (!err) {
        res.send({
          success: true
        });
      } else {
        console.log(err);
        res.sendStatus(500);
      }
    });
  });
});
