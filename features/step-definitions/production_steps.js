const { Given, When, Then } = require('@cucumber/cucumber');
const request = require('supertest');
const expect = require('chai').expect;
const app = require('../../src/app'); // AJUSTAR

let response;
let requestData;

Given('que eu tenho um pedido existente com ID {int}', function (orderId) {
  requestData = { id: orderId, orderStatus: 'RECEIVED' };
});

Given('que eu tenho um ID de pedido inválido', function () {
  requestData = { id: 'abc', orderStatus: 'RECEIVED' };
});

Given('que eu não estou autenticado', function () {
  requestData = { id: 123, orderStatus: 'RECEIVED' };
});

When('eu envio uma requisição PUT para "/orders"', async function () {
  response = await request(app).put('/orders').send(requestData);
});

Then('a resposta deve ter status {int}', function (statusCode) {
  expect(response.status).to.equal(statusCode);
});

Then('o status do pedido deve ser {string}', function (orderStatus) {
  expect(response.body.orderStatus).to.equal(orderStatus);
});