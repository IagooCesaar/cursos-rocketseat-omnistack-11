const request = require('supertest')
const app     = require('../../src/app')
const connection = require('../../src/database/connection')

describe('ONG', () => {

  beforeEach(async () => {
    await connection.migrate.rollback();
    await connection.migrate.latest();
  })

  afterAll(async () => {
    await connection.destroy();
  })

  it('should be able to create a new ONG', async () => {
    const response = await request(app)
      .post('/ongs')
    //.set('Authorization','id válido')
      .send({
        name:     "APAD 2",
        email:    "contato@contato.com.br",
        whatsapp: "35999533347",
        city:     "São Gonçalo do Sapucaí",
        uf:       "MG"
      });
    expect(response.body).toHaveProperty('ong_id');
    expect(response.body.ong_id).toHaveLength(8);

  })
})