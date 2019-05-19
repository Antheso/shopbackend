import * as express from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jwt-simple';
import { mysqlConnection } from '../db/db';
import { config } from '../config';

export const router = express.Router();

router.post('/login', (req, res) => {
  const user = req.body;
  if (!user.login || !user.password) {
    // если один или оба параметра запроса опущены, 
    // возвращаем 400 - Bad Request
    return res.sendStatus(400);
  }

  const login = user.login,
    password = user.password;

  mysqlConnection.query('select * from users where login = ?;', login, (err, rows) => {
    if (!err) {
      const user = rows[0];

      if (!user) {
        return res.sendStatus(401);
      }

      bcrypt.compare(password, user.password, function(err, valid) {
        if (err) {
          return res.sendStatus(500);
        }

        if (!valid) {
          return res.sendStatus(401);
        }

        var token = jwt.encode({ login: login }, config.secretKey)
        res.send({
          success: true,
          data: token
        });
      });
    } else {
      console.log(err);
      res.sendStatus(500);
    }
  });
});
