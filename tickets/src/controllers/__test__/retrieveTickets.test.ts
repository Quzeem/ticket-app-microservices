import request from 'supertest';
import { app } from '../../app';

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signup())
    .send({ title: 'Fanfare', price: 20 });
};

test('should fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const res = await request(app).get('/api/tickets').send().expect(200);
  expect(res.body.data.length).toEqual(3);
});
