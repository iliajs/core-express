import pool from "../db/pool.js";
import {log, logObjects, logOperations} from "../helpers/logs.js";

export const createOrUpdateCustomer = async (req, response) => {
  const customer = req.body;
  if (customer.id) {
    pool.query("update customers set updated_at=now() at time zone 'utc', name=$2, price=$3, currency=$4 where id=$1",
      [customer.id, customer.name, customer.price, customer.currency], async (error, results) => {
      if (error) {
        console.error('error update customer, id: ', customer.id);
        throw error
      }
      await log(logObjects.customer, logOperations.update, customer.id, {
        name: customer.name,
        price: customer.price,
        currency: customer.currency
      })
      console.log('customer updated, id:', customer.id);
      response.send({success: true});
    });
  } else {
    pool.query("insert into customers(created_at, name, price, currency) values(now() at time zone 'utc', $1, $2, $3) RETURNING id",
      [customer.name, customer.price, customer.currency], async (error, result) => {
      if (error) {
        console.error('error add customer');
        throw error
      }
      await log(logObjects.customer, logOperations.insert, result.rows[0].id, {
        name: customer.name,
        price: customer.price,
        currency: customer.currency
      })
      console.log('customer added', result.rows[0].id);
      response.send({ success: true });
    });
  }
}

export const listCustomers = async (request, response) => {
  pool.query("select * from customers where deleted=false order by id desc", async (error, res) => {
    if (error) {
      console.error('error list customers');
      throw error
    }
    console.log('customers listed, count: ', res.rowCount);
    response.send({ success: true, data: res.rows, meta: { count: res.rowCount } });
  });
}

export const showCustomer = async (request, response) => {
  pool.query("select * from customers where id=$1", [request.params.id], async (error, res) => {
    if (error) {
      console.error('error show customer');
      throw error
    }
    console.log('customer shown, id: ', request.params.id);
    if (res.rows.length) {
      response.send({ success: true, data: res.rows[0] });
    } else {
      response.send({ success: false });
    }
  });
}

export const deleteCustomer = async (request, response) => {
  const id = request.params.id;

  pool.query("update customers set deleted_at=now() at time zone 'utc', deleted=true where id=$1", [id], async (error, res) => {
    if (error) {
      console.error('error mark customer as deleted, id: ', id);
      throw error
    }

    await log(logObjects.customer, logOperations.delete, id)
    console.log('customer marked as deleted, id: ', id);

    response.send({ success: true });
  });
}