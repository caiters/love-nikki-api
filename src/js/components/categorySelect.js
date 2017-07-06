function loopOverCategories(categories, newCategories, prefix) {
  for (var key in categories) {
    if (categories.hasOwnProperty(key)) {
      parseCategories(categories[key], newCategories, prefix);
    }
  }
  return newCategories;
}

function parseCategories(category, newCategories, prefix) {
  var categoryToAdd = {
    name: prefix + category.name,
    type: category.type
  };
  newCategories.push(categoryToAdd);
  if (category.children) {
    loopOverCategories(
      category.children,
      newCategories,
      prefix + "&nbsp;&nbsp;&nbsp;"
    );
  }
  return newCategories;
}

Vue.component("category-select", {
  template: `
  <div class="form-group">
    <label class="form-group__label" for="category">Category</label>
    <select id="category" @change="categoryChosen" v-model="chosenCategory">
      <option></option>
      <category v-for="category in arrayOfCategories" :item="category"></category>
    </select>
  </div>
  `,
  props: ["categories", "currentCategory"],
  data: function() {
    return {
      chosenCategory: this.currentCategory
    };
  },
  computed: {
    arrayOfCategories: function() {
      var categories = this.categories;
      var newCategories = [];
      loopOverCategories(categories, newCategories, "");
      return newCategories;
    }
  },
  methods: {
    categoryChosen: function() {
      this.$emit("change", this.chosenCategory);
    }
  }
});
