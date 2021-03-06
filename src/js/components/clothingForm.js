Vue.use(VeeValidate);
var clothingForm = Vue.component("clothing-form", {
  template: `<form id="submitNewClothing" class="clothing-form" @submit.prevent="validateBeforeSubmit" novalidate="novalidate">
  <h1 class="clothing-form__heading">Add New Clothing</h1>
  <div class="form-group" :class="{'form-group--error': errors.has('clothingID')}">
    <label class="form-group__label" for="clothingID">Clothing ID #</label>
    <input class="form-group__input" name="clothingID" id="clothingID" type="text" v-model="clothingFormData.id" v-validate="'required|min:3|numeric'" placeholder="e.g. 001" @change="checkExisting(clothingFormData.id, clothingFormData.category)" />
    <span class="form-group__error" v-if="errors.has('clothingID')">{{errors.first('clothingID')}}</span>
  </div>
  <div class="form-group" :class="{'form-group--error': errors.has('name')}">
    <label class="form-group__label" for="name">Name</label>
    <input class="form-group__input" required type="text" name="name" id="name" v-validate="'required'" v-model="clothingFormData.name" placeholder="e.g. Nikki's Pinky" />
    <span class="form-group__error" v-if="errors.has('name')">{{errors.first('name')}}</span>
  </div>
  <category-select :categories="categories" :current-category="clothingFormData.category" @change="updateCategory"></category-select>
  <div v-if="isExistingItem">
    <p><strong>{{existingItem.name}}</strong> has already been added. Do you want to edit it instead?</p>
    <p>{{existingItem}}</p>
    <button type="button" @click="editExisting">Yes</button> <button type="button" @click="clearForm">No (Clear Form)</button>
  </div>
  <div class="form-group group" :class="{'form-group--error': errors.has('hearts')}">
    <label class="form-group__label" for="hearts">Hearts</label>
    <ul :class="fullHearts ? 'form-group__heart-list form-group__heart-list--full group' : 'form-group__heart-list group'">
      <li :class="selectedHeartsClass(1)">
        <input v-validate="'required'" class="form-group__heart-input" type="radio" name="hearts" v-model.number="clothingFormData.hearts" id="hearts1" :value="1" />
        <label for="hearts1" class="form-group__label--heart"><span class="sr-only">1</span>&hearts;</label>
      </li>
      <li :class="selectedHeartsClass(2)">
        <input class="form-group__heart-input" type="radio" name="hearts" v-model.number="clothingFormData.hearts" id="hearts2" :value="2" />
        <label for="hearts2" class="form-group__label--heart"><span class="sr-only">2</span>&hearts;</label>
      </li>
      <li :class="selectedHeartsClass(3)">
        <input class="form-group__heart-input" type="radio" name="hearts" v-model.number="clothingFormData.hearts" id="hearts3" :value="3" />
        <label for="hearts3" class="form-group__label--heart"><span class="sr-only">3</span>&hearts;</label>
      </li>
      <li :class="selectedHeartsClass(4)">
        <input class="form-group__heart-input" type="radio" name="hearts" v-model.number="clothingFormData.hearts" id="hearts4" :value="4" />
        <label for="hearts4" class="form-group__label--heart"><span class="sr-only">4</span>&hearts;</label>
      </li>
      <li :class="selectedHeartsClass(5)">
        <input class="form-group__heart-input" type="radio" name="hearts" v-model.number="clothingFormData.hearts" id="hearts5" :value="5" />
        <label for="hearts5" class="form-group__label--heart"><span class="sr-only">5</span>&hearts;</label>
      </li>
      <li :class="selectedHeartsClass(6)">
        <input class="form-group__heart-input" type="radio" name="hearts" v-model.number="clothingFormData.hearts" id="hearts6" :value="6" />
        <label for="hearts6" class="form-group__label--heart"><span class="sr-only">6</span>&hearts;</label>
      </li>
    </ul>

    <span class="form-group__error" v-if="errors.has('hearts')">{{errors.first('hearts')}}</span>
  </div>
  <style-checkboxes :styles="orderedStyles" :current-styles="clothingFormData.clothingStyles" @change="updateStyleArray"></style-checkboxes>
  <style-ratings :styles="clothingFormData.clothingStyles" :current-ratings="clothingFormData.ratings" @change="updateRatings"></style-ratings>
  <tags :tags="orderedTags" @change="updateTags" :current-tags="clothingFormData.tags"></tags>
  <customization @change="updateCustomItems" :is-customizable="clothingFormData.customizable" :customizations="clothingFormData.customizableItems" @toggled="updateCustomizable"></customization>
  <button type="submit">Submit Clothing</button>
</form>`,
  props: ["id", "category"],
  data: function() {
    return {
      finished: false,
      clothingFormData: {
        id: "",
        category: "",
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
    var paramId = this.id;
    var paramCat = this.category;
    store.dispatch("load").then(function() {
      if (form.id && form.category) {
        if (form.id.length === 3 && form.category.length > 0) {
          form.clothingFormData.id = form.id;
          form.clothingFormData.category = form.category;
          var item = store.state.clothes[form.id + "-" + form.category];
          if (item) {
            form.isExistingItem = true;
            form.existingItem = item;
          }
          form.editExisting();
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
