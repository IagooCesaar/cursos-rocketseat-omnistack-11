const MOCK_ONG_1 = {
  name: "ONG TESTE",
  email: "teste@teste.com",
  password: "abc123",
  whatsapp: "5535998155841",
  city: "São Gonçalo do Sapucaí",
  uf: "MG",
};

const MOCK_ONG_2 = (complemento) => ({
  name: `ONG TESTE ${complemento}`,
  email: `${complemento}@teste.com`,
  password: "abc123",
  whatsapp: "5535998155841",
  city: "São Gonçalo do Sapucaí",
  uf: "MG",
});

module.exports = {
  MOCK_ONG_1,
  MOCK_ONG_2,
};
