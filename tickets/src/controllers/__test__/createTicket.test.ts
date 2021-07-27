import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticketModel';

test('should have a route handler /api/tickets listening for POST requests', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).not.toEqual(404);
});

test('should only be accessible if a user is authenticated', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).toEqual(401);
});

test('should return a statusCode than 401 if a user is authenticated', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({});

  expect(res.status).not.toEqual(401);
});

test('should return an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: '', price: 10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ price: 10 })
    .expect(400);
});

test('should return an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'Fanfare', price: -10 })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'Fanfare' })
    .expect(400);
});

test('should create a ticket with valid inputs', async () => {
  let tickets = await Ticket.countDocuments({});
  expect(tickets).toEqual(0);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'Fanfare', price: 20 })
    .expect(201);

  tickets = await Ticket.countDocuments({});
  expect(tickets).toEqual(1);
});
