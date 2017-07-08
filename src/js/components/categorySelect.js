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
  <div class="form-group" :class="{'form-group--error': errors.has('category')}">
    <label class="form-group__label" for="category">Category</label>
    <select name="category" id="category" @change="categoryChosen" v-model="chosenCategory" v-validate="'required'">
      <option></option>
      <category v-for="category in arrayOfCategories" :item="category"></category>
    </select>
    <span class="form-group__error" v-if="errors.has('category')">{{errors.first('category')}}</span>
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
  created: function() {
    var form = this;
    bus.$emit("componentValidateable", "category select");
    bus.$on("validateForm", function() {
      form.$validator.validateAll().then(function(result) {
        if (result) {
          bus.$emit("componentOK");
        } else {
          bus.$emit("componentError", form.$validator.errorBag.errors);
        }
      });
    });
    bus.$on("FormSubmitted", function() {
      form.chosenCategory = "";
    });
  },
  methods: {
    categoryChosen: function() {
      this.$emit("change", this.chosenCategory);
    }
  }
});
