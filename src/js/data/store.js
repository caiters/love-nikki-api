var store = new Vuex.Store({
  state: {
    styles: [
      "Gorgeous",
      "Simple",
      "Elegance",
      "Lively",
      "Mature",
      "Cute",
      "Sexy",
      "Pure",
      "Warm",
      "Cool"
    ],
    tags: [
      "Sun Care",
      "Dancer",
      "Floral",
      "Winter",
      "Britain",
      "Swimsuit",
      "Shower",
      "Kimono",
      "Pajamas",
      "Wedding",
      "Army",
      "Office",
      "Apron",
      "Cheongsam",
      "Maiden",
      "Evening Gown",
      "Navy",
      "Traditional",
      "Bunny",
      "Lady",
      "Lolita",
      "Gothic",
      "Sports",
      "Harajuku",
      "Preppy",
      "Unisex",
      "Future",
      "Fairy",
      "Rock",
      "Denim",
      "Pet",
      "Goddess",
      "POP",
      "Homewear",
      "Chinese Classical",
      "Hindu",
      "Republic of China",
      "European",
      "Swordsman",
      "Rain",
      "Modern China",
      "Dryad",
      "Bohemia",
      "Paramedics"
    ],
    categories: [],
    clothes: {},
    loading: false
  },
  mutations: {
    add: function(state, newItems) {
      return Object.assign(state, newItems);
    },
    loading: function(state) {
      return Object.assign(state, { loading: true });
    },
    doneLoading: function(state) {
      return Object.assign(state, { loading: false });
    },
    setCategories: function(state, categories) {
      return Object.assign(state, { categories: categories });
    },
    setClothes: function(state, clothes) {
      return Object.assign(state, { clothes: clothes });
    },
    updateClothes: function(state, clothingItem) {
      state.clothes[clothingItem.id] = Object.assign({}, clothingItem);
      return state;
    }
  },
  actions: {
    load: function(context) {
      context.commit("loading");
      let categories = fetch("/api/categories")
        .then(function(res) {
          return res.json();
        })
        .then(function(categories) {
          context.commit("setCategories", categories);
        });
      let clothes = fetch("/api/clothes")
        .then(function(res) {
          return res.json();
        })
        .then(function(clothes) {
          context.commit("setClothes", clothes);
        });
      return Promise.all([categories, clothes]).then(function() {
        context.commit("doneLoading");
      });
    },
    addClothingItem: function(context, clothingItem) {
      context.commit("loading");
      return fetch(
        "/api/clothes/" + clothingItem.category + "/" + clothingItem.id,
        {
          method: "put",
          headers: new Headers({ "Content-Type": "application/JSON" }),
          body: JSON.stringify(clothingItem)
        }
      )
        .then(function() {
          return context.commit("updateClothes", clothingItem);
        })
        .then(function() {
          return context.commit("doneLoading");
        });
    }
  }
});
