import request from 'supertest';
import mongoose from 'mongoose'
import { app } from '../../app';
import { Order } from '../../models/orderModel';
import { Ticket } from '../../models/ticketModel';

// Create ticket helper
const createTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 20,
  });
  await ticket.save();

  return ticket;
};

test('should fetch orders of a specific user', async () => {
  // Signup two users
  const userOneCookie = global.signup();
  const userTwoCookie = global.signup();

  // Create three tickets
  const ticketOne = await createTicket();
  const ticketTwo = await createTicket();
  const ticketThree = await createTicket();

  // Create one order for userOne
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOneCookie)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two orders for userTwo
  const {
    body: { data: orderOne },
  } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwoCookie)
    .send({ ticketId: ticketTwo.id })
    .expect(201);
  const {
    body: { data: orderTwo },
  } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwoCookie)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // retrieve userTwo orders
  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwoCookie)
    .expect(200);

  // Make assertions that we only got orders of userTwo
  // console.log(res.body.data);
  // console.log(orderOne);
  expect(res.body.data.length).toEqual(2);
  expect(res.body.data[0].id).toEqual(orderOne.id);
  expect(res.body.data[1].id).toEqual(orderTwo.id);
  expect(res.body.data[0].ticket.id).toEqual(ticketTwo.id);
  expect(res.body.data[1].ticket.id).toEqual(ticketThree.id);
});
