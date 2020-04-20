exports.up = function (knex) {
  return knex.schema.createTable("incidents", function (table) {
    table.increments("id").primary();
    table.integer("ong_id").unsigned().notNullable();
    table.string("title").notNullable();
    table.string("description").notNullable();
    table.decimal("value").notNullable();
    table.boolean("active").notNullable().defaultTo(true);

    table.foreign("ong_id").references("id").inTable("ongs");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("incidents");
};
