var clothingEdit = Vue.component("clothing-edit", {
  template: `<form id="submitNewClothing" class="clothing-form" @submit.prevent="validateBeforeSubmit" novalidate="novalidate">
  <h1 class="clothing-form__heading">Edit Clothing</h1>
  <form-body :clothing="clothingFormData"></form-body>
  <button type="submit">Submit Clothing</button>
</form>`,
  props: ["id", "category"],
  data: function() {
    return {
      finished: false,
      clothingFormData: {
        name: "",
        hearts: null,
        clothingStyles: [],
        ratings: {},
        tags: [],
        customizable: false,
        customizableItems: []
      },
      componentsToValidate: 0,
      componentsOK: 0,
      componentsErrored: 0,
      isExistingItem: false
    };
  },
  mounted: function() {
    bus.$emit("componentValidateable", "main form");
  },
  created: function() {
    var form = this;
    var paramId = this.id;
    var paramCat = this.category;
    store.dispatch("load").then(function() {
      if (form.id && form.category) {
        if (
          (form.id.length === 3 || form.id.length === 4) &&
          form.category.length > 0
        ) {
          form.clothingFormData.id = form.id;
          form.clothingFormData.category = form.category;
          var item = store.state.clothes[form.id + "-" + form.category];
          var itemsArray = [];
          _.forEach(item.customizations, function(item) {
            var itemObj = {
              id: item
            };
            itemsArray.push(itemObj);
          });
          if (item) {
            form.isExistingItem = true;
            form.clothingFormData = item;
            form.clothingFormData = {
              id: item.id,
              category: item.category,
              name: item.name,
              hearts: item.hearts,
              clothingStyles: Object.keys(item.style),
              ratings: item.style,
              tags: item.tags,
              customizable: item.customizable,
              customizableItems: itemsArray
            };
          }
        }
      }
    });

    bus.$on("componentValidateable", function(name) {
      form.componentsToValidate++;
    });

    bus.$on("componentOK", function() {
      form.componentsOK++;
      if (form.componentsToValidate === form.componentsOK) {
        form.submitForm();
      }
    });

    bus.$on("componentError", function() {
      form.componentsErrored++;
    });
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
      this.checkExisting(
        this.clothingFormData.id,
        this.clothingFormData.category
      );
    },
    checkExisting: function(id, category) {
      console.log(id);
      console.log(category);
      console.log("checking");
      if (category.length > 0 && id.length === 3) {
        var item = store.state.clothes[id + "-" + category];
        if (item) {
          this.isExistingItem = true;
          this.clothingFormData = item;
        } else {
          //this.isExistingItem = false;
          //this.existingItem = {};
        }
      } else {
        //this.isExistingItem = false;
        //this.existingItem = {};
      }
    },
    editExisting: function() {
      this.clothingFormData = {
        id: this.existingItem.id,
        category: this.existingItem.category,
        name: this.existingItem.name,
        hearts: this.existingItem.hearts,
        clothingStyles: Object.keys(this.existingItem.style),
        ratings: this.existingItem.style,
        tags: this.existingItem.tags,
        customizable: this.existingItem.customizable,
        customizableItems: itemsArray
      };
    },
    clearForm: function(e) {
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
      bus.$emit("FormCleared");
    },
    submitClothing: function(e) {
      store.dispatch("addClothingItem", this.reformatObject);
      this.clearForm();
    },
    validateBeforeSubmit: function() {
      var form = this;
      form.componentsOK = 0;
      form.componentsErrored = 0;
      bus.$emit("validateForm");
      form.$validator.validateAll().then(function(result) {
        if (result) {
          bus.$emit("componentOK");
        } else {
          bus.$emit("componentError", form.$validator.errorBag.errors);
        }
      });
    },
    submitForm: function() {
      return this.submitClothing();
    }
  }
});
