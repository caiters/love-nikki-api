const express = require("express"),
  app = express(),
  db = require("knex")({
    client: "pg",
    connection: process.env.DATABASE_URL
  }),
  bodyParser = require("body-parser"),
  _ = require("lodash"),
  Promise = require("bluebird"),
  cors = require("cors");

app.use(bodyParser.json());

app.use(cors());

app.get("/", function(req, res) {
  return res.send("hello world");
});

function buildCategoryTree(categories, children, categoriesByName) {
  return _.map(categories, function(category) {
    let c = {
      name: category.name
    };
    if (children[category.name].length > 0) {
      c.type = "container";
      c.children = buildCategoryTree(
        _.map(children[category.name], function(child) {
          return categoriesByName[child];
        }),
        children,
        categoriesByName
      );
    } else {
      c.type = "category";
    }
    return c;
  });
}

app.get("/categories", function(req, res) {
  return db.select().from("categories").then(function(categories) {
    let children = {};
    _.forEach(categories, function(category) {
      if (!children.hasOwnProperty(category.name)) {
        children[category.name] = [];
      }
      if (category.parent) {
        if (!children.hasOwnProperty(category.parent)) {
          children[category.parent] = [];
        }
        if (children[category.parent].indexOf(category.name) < 0) {
          children[category.parent].push(category.name);
        }
      }
    });
    let categoriesByName = _.zipObject(_.map(categories, "name"), categories);

    let categoriesTree = buildCategoryTree(
      _.filter(categories, { parent: null }),
      children,
      categoriesByName
    );

    return res.json(categoriesTree);
  });
});

app.post("/categories", function(req, res, next) {
  return db("categories")
    .insert(req.body)
    .then(function(data) {
      return res.json(data);
    })
    .catch(next);
});

app.get("/clothes", function(req, res) {
  return db
    .select(
      "clothes.id",
      "clothes.name",
      "tags.tag",
      "clothes.customizable",
      "clothes.hearts",
      "clothes.category",
      "customizations.customizesToId as customizations",
      "styles.style",
      "styles.rating"
    )
    .from("clothes")
    .leftOuterJoin("tags", {
      "clothes.id": "tags.clothingId",
      "clothes.category": "tags.clothingCategory"
    })
    .leftOuterJoin("styles", {
      "clothes.id": "styles.clothingId",
      "clothes.category": "styles.clothingCategory"
    })
    .leftOuterJoin("customizations", {
      "clothes.id": "customizations.clothingId",
      "clothes.category": "customizations.clothingCategory"
    })
    .then(function(clothes) {
      return _.groupBy(clothes, "id");
    })
    .then(function(clothes) {
      // TODO: have to fix this now that category id is being figured into each thing
      return _.mapValues(clothes, function(dupeClothes) {
        let styles = _.map(dupeClothes, function(clothing) {
          return { style: clothing.style, rating: clothing.rating };
        });
        let tags = _.map(dupeClothes, "tag");
        let customizations = _.map(dupeClothes, "customizations");
        let clothing = dupeClothes[0];
        delete clothing.tag;
        delete clothing.rating;
        delete clothing.style;
        clothing.style = _.reduce(
          styles,
          function(styles, style) {
            styles[style.style] = style.rating;
            return styles;
          },
          {}
        );
        clothing.tags = _.uniq(tags);
        clothing.customizations = _.uniq(customizations);
        return clothing;
      });
    })
    .then(function(clothes) {
      return res.json(clothes);
    });
});

function upsertItem(db, table, item, where) {
  return db.select().from(table).where(where).then(function(rows) {
    if (rows.length > 0) {
      // updating!
      return db(table).where(where).update(item);
    } else {
      //inserting
      return db(table).insert(item);
    }
  });
}

app.put("/clothes/:category/:id", function(req, res, next) {
  req.body.id = req.params.id;
  req.body.category = req.params.category;
  let clothing = Object.assign({}, req.body);
  let tags = clothing.tags;
  let styles = clothing.style;
  let customizations = clothing.customizations;
  delete clothing.tags;
  delete clothing.style;
  delete clothing.customizations;
  return db
    .transaction(function(tx) {
      return upsertItem(tx, "clothes", clothing, {
        id: clothing.id
      }).then(function(data) {
        let promises = [];
        if (tags) {
          promises.push(
            tx("tags")
              .where({
                clothingId: clothing.id,
                clothingCategory: clothing.category
              })
              .del()
              .then(function() {
                return tx("tags").insert(
                  _.map(tags, function(tag) {
                    return {
                      tag: tag,
                      clothingId: clothing.id,
                      clothingCategory: clothing.category
                    };
                  })
                );
              })
          );
        }
        if (styles) {
          promises.push(
            tx("styles")
              .where({
                clothingId: clothing.id,
                clothingCategory: clothing.category
              })
              .del()
              .then(function() {
                return tx("styles").insert(
                  _.map(styles, function(rating, style) {
                    return {
                      style: style,
                      rating: rating,
                      clothingId: clothing.id,
                      clothingCategory: clothing.category
                    };
                  })
                );
              })
          );
        }
        if (customizations) {
          promises.push(
            tx("customizations")
              .where({
                clothingId: clothing.id,
                clothingCategory: clothing.category
              })
              .del()
              .then(function() {
                return tx("customizations").insert(
                  _.map(customizations, function(customizesToId) {
                    return {
                      clothingId: clothing.id,
                      customizesToId: customizesToId,
                      clothingCategory: clothing.category
                    };
                  })
                );
              })
          );
        }
        return Promise.all(promises);
      });
    })
    .then(function() {
      return res.json(req.body);
    })
    .catch(next);
});

app.use(function(err, req, res, next) {
  return res.status(500).json({
    error: err.message,
    stack: err.stack
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("listening on " + (process.env.PORT || 3000));
});
