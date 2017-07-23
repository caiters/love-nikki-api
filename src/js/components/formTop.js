var formTop = Vue.component("form-top", {
  template: `
  <div class="form-top">
    <div class="form-group" :class="{'form-group--error': errors.has('clothingID')}">
      <label class="form-group__label" for="clothingID">Clothing ID #</label>
      <input class="form-group__input" name="clothingID" id="clothingID" type="text" v-model="clothingID" v-validate="'required|min:3|numeric'" placeholder="e.g. 001" @change="change" />
      <span class="form-group__error" v-if="errors.has('clothingID')">{{errors.first('clothingID')}}</span>
    </div>
    <category-select :categories="categories" :current-category="category" @change="changedCategory"></category-select>
    <div class="form-message form-message--duplicate" v-if="isDuplicate">
      <p><strong>{{existingItem.name}}</strong> has already been added. Do you want to edit it instead?</p>
      <p>{{existingItem}}</p>
      <router-link :to="'/' + clothingID + '/' + category + '/edit'">Yes</router-link>
    </div>
  </div>
  `,
  props: ["currentCategory"],
  data: function() {
    return {
      clothingID: "",
      category: "",
      existingItem: {}
    };
  },
  created: function() {
    var form = this;
    bus.$emit("componentValidateable", "formTop");
    bus.$on("validateForm", function() {
      form.$validator.validateAll().then(function(result) {
        if (result) {
          bus.$emit("componentOK");
        } else {
          bus.$emit("componentError", form.$validator.errorBag.errors);
        }
      });
    });
    bus.$on("FormCleared", function() {
      form.clothingID = "";
      form.category = "";
      form.existingItem = {};
    });
  },
  computed: {
    categories: function() {
      return store.state.categories;
    },
    isDuplicate: function() {
      var category = this.category;
      var clothingID = this.clothingID;
      if (category.length > 0 && clothingID.length === 3) {
        var item = store.state.clothes[clothingID + "-" + category];
        if (item) {
          this.existingItem = item;
          return true;
        }
        this.existingItem = {};
        return false;
      }
    }
  },
  methods: {
    change: function(attr) {
      var formTopData = {};
      formTopData.id = this.clothingID;
      formTopData.category = this.category;
      console.log(formTopData);
      this.$emit("changeFormTop", formTopData);
    },
    changedCategory: function(attr) {
      this.category = attr;
      this.change();
    }
  }
});
