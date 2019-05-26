import * as express from 'express';
import { mysqlConnection } from '../db/db';
import { isAdmin } from '../middlewares/admin';

export const router = express.Router();

router.get('/employees', (req, res) => {
  isAdmin(req, res, function() {
    const limit = +req.query.limit || 5,
      offset = +req.query.offset || 0;
  
    mysqlConnection.query('select count(*) as count from emp;', (err, rows) => {
      const count = rows[0].count;
      if (!err) {
        mysqlConnection.query('select * from emp limit ?, ?;', [offset, limit], (err, rows) => {
          if (!err) {
            res.send({
              success: true,
              data: {
                emp: rows,
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

router.post('/employees', (req, res) => {
  isAdmin(req, res, function() {
    const product = req.body,
      sql = 'insert into emp set ?;';
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

router.post('/employees', (req, res) => {
  isAdmin(req, res, function() {
    const product = req.body,
      sql = 'insert into emp set ?;';
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

router.get('/employees/all', (req, res) => {
  isAdmin(req, res, function() {
    mysqlConnection.query('select * from emp;', (err, rows) => {
      if (!err) {
        res.send({
          success: true,
          data: {
            emp: rows
          }
        });
      } else {
        console.log(err);
        res.sendStatus(500);
      }
    });
  });
});
