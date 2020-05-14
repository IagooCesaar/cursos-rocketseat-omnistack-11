exports.up = function (knex) {
  return knex.schema.createTable("ongs", function (table) {
    table.increments("id").primary();
    table.string("name", 100).notNullable();
    table.string("password", 60).notNullable();
    table.string("email", 100).notNullable();
    table.string("whatsapp", 13).notNullable();
    table.string("city", 60).notNullable();
    table.string("uf", 2).notNullable();
    table.boolean("active").notNullable().defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("ongs");
};
