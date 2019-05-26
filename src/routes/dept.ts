import * as express from 'express';
import { mysqlConnection } from '../db/db';
import { isAdmin } from '../middlewares/admin';

export const router = express.Router();

router.get('/departments', (req, res) => {
  isAdmin(req, res, function() {
    const limit = +req.query.limit || 5,
      offset = +req.query.offset || 0;
  
    mysqlConnection.query('select count(*) as count from dept;', (err, rows) => {
      const count = rows[0].count;
      if (!err) {
        mysqlConnection.query('select * from dept limit ?, ?;', [offset, limit], (err, rows) => {
          if (!err) {
            res.send({
              success: true,
              data: {
                dept: rows,
                limit,
                offset,
                count
              }
            });
          } else {
            console.log(err);
            res.sendStatus(500);
          }
        });
      } else {
        console.log(err);
        res.sendStatus(500);
      }
    });
  });
});

router.get('/departments/all', (req, res) => {
  isAdmin(req, res, function() {
    mysqlConnection.query('select * from dept;', (err, rows) => {
      if (!err) {
        res.send({
          success: true,
          data: {
            dept: rows
          }
        });
      } else {
        console.log(err);
        res.sendStatus(500);
      }
    });
  });
});

router.post('/departments', (req, res) => {
  isAdmin(req, res, function() {
    const product = req.body,
      sql = 'insert into dept set ?;';
    mysqlConnection.query(sql, product, (err) => {
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
