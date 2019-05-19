import * as express from 'express';
import { mysqlConnection } from '../db/db';
import { isAdmin } from '../middlewares/admin';

export const router = express.Router();

router.get('/products', (req, res) => {
  const limit = +req.query.limit || 3,
    offset = +req.query.offset || 0;

  mysqlConnection.query('select count(*) as count from products;', (err, rows) => {
    const count = rows[0].count;
    if (!err) {
      mysqlConnection.query('SELECT * FROM products prod limit ?, ?;', [offset, limit], (err, rows) => {
        if (!err) {
          res.send({
            success: true,
            data: {
              products: rows,
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

router.post('/products', (req, res) => {
  isAdmin(req, res, function() {
    const product = req.body,
      sql = 'insert into products set ?;';
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

router.get('/products/:id', (req, res) => {
  mysqlConnection.query('select * from products where product_id = ?;', [req.params.id], (err, rows) => {
    if (!err) {
      res.send({
        success: true,
        data: rows[0]
      });
    } else {
      console.log(err);
      res.sendStatus(500);
    }
  });
});

router.delete('/products/:id', (req, res) => {
  isAdmin(req, res, function() {
    mysqlConnection.query('delete from products where product_id = ?;', [req.params.id], (err) => {
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

router.patch('/products/:id', (req, res) => {
  isAdmin(req, res, function() {
    const product = req.body;
    mysqlConnection.query('update products set ? where product_id = ?;', [product, req.params.id], (err) => {
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
