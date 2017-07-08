exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("categories").del().then(function() {
    // Inserts seed entries
    return knex("categories").insert([
      { name: "Hair" },
      { name: "Dress" },
      { name: "Coat" },
      { name: "Tops" },
      { name: "Bottoms" },
      { name: "Hosiery" },
      { name: "Shoes" },
      { name: "Accessory" },
      { name: "Headwear", parent: "Accessory" },
      { name: "Hair ornaments", parent: "Headwear" },
      { name: "Veil", parent: "Headwear" },
      { name: "Hairpin", parent: "Headwear" },
      { name: "Ear", parent: "Headwear" },
      { name: "Earrings", parent: "Accessory" },
      { name: "Necklaces", parent: "Accessory" },
      { name: "Scarf", parent: "Necklaces" },
      { name: "Necklace", parent: "Necklaces" },
      { name: "Bracelet", parent: "Accessory" },
      { name: "Right hand ornaments", parent: "Bracelet" },
      { name: "Left hand ornaments", parent: "Bracelet" },
      { name: "Glove", parent: "Bracelet" },
      { name: "Handheld", parent: "Accessory" },
      { name: "Right hand holding", parent: "Handheld" },
      { name: "Left hand holding", parent: "Handheld" },
      { name: "Both hand holding", parent: "Handheld" },
      { name: "Waist", parent: "Accessory" },
      { name: "Special", parent: "Accessory" },
      { name: "Face", parent: "Special" },
      { name: "Brooch", parent: "Special" },
      { name: "Tattoo", parent: "Special" },
      { name: "Wing", parent: "Special" },
      { name: "Tail", parent: "Special" },
      { name: "Foreground", parent: "Special" },
      { name: "Background", parent: "Special" },
      { name: "Head ornaments", parent: "Special" },
      { name: "Ground", parent: "Special" },
      { name: "Skin", parent: "Special" },
      { name: "Makeup" }
    ]);
  });
};
