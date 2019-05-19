import * as mysql from 'mysql';

export const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'shopdb'
});

mysqlConnection.connect((err) => {
  if(!err) {
    console.log('DB connection success');
  } else {
    console.log(`DB connection failed \n Error : ${ JSON.stringify(err, undefined, 2) }`);
  }
});
