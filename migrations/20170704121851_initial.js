exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("categories", function(table) {
      table.string("name").primary();
      table.string("parent").nullable().references("name");
    })
    .then(function() {
      return knex.schema
        .createTable("clothes", function(table) {
          table.string("id");
          table.string("name");
          table.integer("hearts");
          table.boolean("customizable").defaultTo(false);
          table.string("category").references("categories.name");
          table.primary(["id", "category"]);
          table.index("category");
        })
        .then(function() {
          let styles = knex.schema.createTable("styles", function(table) {
            table.string("style");
            table.enu("rating", [
              "ss",
              "s",
              "a",
              "b",
              "c",
              "SS",
              "S",
              "A",
              "B",
              "C"
            ]);
            table.string("clothingId");
            table.string("clothingCategory");
            table
              .foreign(["clothingId", "clothingCategory"])
              .references(["clothes.id", "clothes.category"]);
            table.primary(["style", "clothingId", "clothingCategory"]);
            table.index(["clothingId", "clothingCategory"]);
          });

          let tags = knex.schema.createTable("tags", function(table) {
            table.string("tag");
            table.string("clothingId");
            table.string("clothingCategory");
            table
              .foreign(["clothingId", "clothingCategory"])
              .references(["clothes.id", "clothes.category"]);
            table.primary(["tag", "clothingId", "clothingCategory"]);
            table.index(["clothingId", "clothingCategory"]);
          });

          let customizations = knex.schema.createTable(
            "customizations",
            function(table) {
              table.string("clothingId");
              table.string("clothingCategory");
              table
                .foreign(["clothingId", "clothingCategory"])
                .references(["clothes.id", "clothes.category"]);
              table.string("customizesToId");
              table.primary([
                "clothingId",
                "customizesToId",
                "clothingCategory"
              ]);
              table.index(["clothingId", "clothingCategory"]);
            }
          );

          return Promise.all([styles, tags, customizations]);
        });
    });
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable("tags"),
    knex.schema.dropTable("styles"),
    knex.schema.dropTable("customizations")
  ])
    .then(function() {
      return knex.schema.dropTable("clothes");
    })
    .then(function() {
      return knex.schema.dropTable("categories");
    });
};
