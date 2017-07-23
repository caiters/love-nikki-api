Vue.use(VeeValidate);
var clothingAdd = Vue.component("clothing-form", {
  template: `<form id="submitNewClothing" class="clothing-form" @submit.prevent="validateBeforeSubmit" novalidate="novalidate">
  <h1 class="clothing-form__heading">Add New Clothing</h1>
  <form-top @change="updateCategory" @changeFormTop="updateClothingUnique"></form-top>
  <form-body :clothing="clothingFormDataBody" @changeFormBody="updateClothingBody"></form-body>
  {{combinedObject}}
  <button type="submit">Submit Clothing</button>
</form>`,
  props: ["id", "category"],
  data: function() {
    return {
      finished: false,
      clothingFormDataTop: {
        id: "",
        category: ""
      },
      clothingFormDataBody: {
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
      isExistingItem: false,
      existingItem: {}
    };
  },
  mounted: function() {
    bus.$emit("componentValidateable", "main form");
  },
  created: function() {
    var form = this;

    store.dispatch("load");

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
    combinedObject: function() {
      return _.assign({}, this.clothingFormDataTop, this.clothingFormDataBody);
    },
    reformatObject: function() {
      var data = this.combinedObject;
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
    updateClothingUnique: function(obj) {
      this.clothingFormDataTop.id = obj.id;
      this.clothingFormDataTop.category = obj.category;
    },
    updateClothingBody: function(obj) {
      this.clothingFormDataBody = obj;
    },
    updateStyleArray: function(value) {
      this.clothingFormDataBody.clothingStyles = value;
    },
    updateCustomItems: function(items) {
      this.clothingFormDataBody.customizableItems = items;
    },
    updateRatings: function(ratings) {
      this.clothingFormDataBody.ratings = ratings;
    },
    updateTags: function(tags) {
      this.clothingFormDataBody.tags = tags;
    },
    updateCustomizable: function(customizable) {
      this.clothingFormDataBody.customizable = customizable;
    },
    updateCategory: function(category) {
      this.clothingFormDataTop.category = category;
    },
    checkExisting: function(id, category) {
      console.log(id);
      console.log(category);
      console.log("checking");
      if (category.length > 0 && id.length === 3) {
        var item = store.state.clothes[id + "-" + category];
        if (item) {
          this.isExistingItem = true;
          this.existingItem = item;
        } else {
          this.isExistingItem = false;
          this.existingItem = {};
        }
      } else {
        this.isExistingItem = false;
        this.existingItem = {};
      }
    },
    editExisting: function() {
      var itemsArray = [];
      console.log("before");
      _.forEach(this.existingItem.customizations, function(item) {
        console.log(item);
        var itemObj = {
          id: item
        };
        itemsArray.push(itemObj);
      });
      console.log("after");
      console.log(itemsArray);
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
      console.log("validated");
    },
    submitClothing: function(e) {
      console.log("submitting clothes");
      store.dispatch("addClothingItem", this.reformatObject);
      this.clearForm();
    },
    submitForm: function() {
      console.log("submitting form");
      return this.submitClothing();
    }
  }
});
