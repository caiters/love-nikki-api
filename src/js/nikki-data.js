Vue.use(VeeValidate);

var app = new Vue({
  el: "#nikki",
  data: {
    finished: false,
    clothingFormData: {
      id: "",
      category: "",
      name: "",
      hearts: 0,
      clothingStyles: [],
      ratings: {},
      tags: [],
      customizable: false,
      customizableItems: []
    }
  },
  mounted: function() {
    store.dispatch("load");
  },
  computed: {
    categories: function() {
      return store.state.categories;
    },
    orderedStyles: function() {
      return store.state.styles.sort();
    },
    orderedTags: function() {
      return store.state.tags.sort();
    },
    fullHearts: function() {
      return this.clothingFormData.hearts >= 6;
    },
    reformatObject: function() {
      var data = this.clothingFormData;
      return {
        id: data.id,
        name: data.name,
        hearts: data.hearts,
        category: data.category,
        style: data.ratings,
        tags: data.tags,
        customizable: data.customizable,
        customizations: _.map(data.customizableItems, "id")
      };
    }
  },
  methods: {
    updateStyleArray: function(value) {
      this.clothingFormData.clothingStyles = value;
    },
    selectedHeartsClass: function(num) {
      return this.clothingFormData.hearts >= num
        ? "form-group__heart--selected form-group__heart"
        : "form-group__heart";
    },
    updateCustomItems: function(items) {
      this.clothingFormData.customizableItems = items;
    },
    updateRatings: function(ratings) {
      this.clothingFormData.ratings = ratings;
    },
    updateTags: function(tags) {
      this.clothingFormData.tags = tags;
    },
    updateCustomizable: function(customizable) {
      this.clothingFormData.customizable = customizable;
    },
    updateCategory: function(category) {
      this.clothingFormData.category = category;
    },
    submitClothing: function(e) {
      e.preventDefault();
      store.dispatch("addClothingItem", this.reformatObject);
      var emptyData = {
        id: "",
        category: "",
        name: "",
        hearts: 0,
        clothingStyles: [],
        ratings: {},
        tags: [],
        customizable: false,
        customizableItems: []
      };
      this.clothingFormData = emptyData;
      this.updateCustomItems(emptyData.customizableItems);
      this.updateRatings(emptyData.ratings);
      this.updateTags(emptyData.tags);
      this.updateCustomizable(emptyData.customizable);
      this.updateCategory(emptyData.category);
      this.updateStyleArray(emptyData.clothingStyles);
    }
  }
});

app.$validator.updateDictionary(customValidationMsgs);
