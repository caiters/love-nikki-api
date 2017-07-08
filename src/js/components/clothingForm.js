var clothingForm = Vue.component("clothing-form", {
  template: `<form id="submitNewClothing" class="clothing-form" @submit.prevent="validateBeforeSubmit">
  <h1 class="clothing-form__heading">Add New Clothing</h1>
  <div class="form-group">
    <label class="form-group__label" for="clothingID">Clothing ID #</label>
    <input class="form-group__input" required type="text" v-model="clothingFormData.id" placeholder="e.g. 001" />
  </div>
  <div class="form-group">
    <label class="form-group__label" for="name">Name</label>
    <input class="form-group__input" required type="text" v-model="clothingFormData.name" placeholder="e.g. Nikki's Pinky" />
  </div>
  <category-select :categories="categories" :current-category="clothingFormData.category" @change="updateCategory"></category-select>
  <div class="form-group group">
    <label class="form-group__label" for="hearts">Hearts</label>
    <ul :class="fullHearts ? 'form-group__heart-list form-group__heart-list--full group' : 'form-group__heart-list group'">
      <li :class="selectedHeartsClass(1)">
        <input required class="form-group__heart-input" type="radio" name="hearts" v-model.number="clothingFormData.hearts" id="hearts1" value="1" />
        <label for="hearts1" class="form-group__label--heart"><span class="sr-only">1</span>&hearts;</label>
      </li>
      <li :class="selectedHeartsClass(2)">
        <input required class="form-group__heart-input" type="radio" name="hearts" v-model.number="clothingFormData.hearts" id="hearts2" value="2" />
        <label for="hearts2" class="form-group__label--heart"><span class="sr-only">2</span>&hearts;</label>
      </li>
      <li :class="selectedHeartsClass(3)">
        <input required class="form-group__heart-input" type="radio" name="hearts" v-model.number="clothingFormData.hearts" id="hearts3" value="3" />
        <label for="hearts3" class="form-group__label--heart"><span class="sr-only">3</span>&hearts;</label>
      </li>
      <li :class="selectedHeartsClass(4)">
        <input required class="form-group__heart-input" type="radio" name="hearts" v-model.number="clothingFormData.hearts" id="hearts4" value="4" />
        <label for="hearts4" class="form-group__label--heart"><span class="sr-only">4</span>&hearts;</label>
      </li>
      <li :class="selectedHeartsClass(5)">
        <input required class="form-group__heart-input" type="radio" name="hearts" v-model.number="clothingFormData.hearts" id="hearts5" value="5" />
        <label for="hearts5" class="form-group__label--heart"><span class="sr-only">5</span>&hearts;</label>
      </li>
      <li :class="selectedHeartsClass(6)">
        <input required class="form-group__heart-input" type="radio" name="hearts" v-model.number="clothingFormData.hearts" id="hearts6" value="6" />
        <label for="hearts6" class="form-group__label--heart"><span class="sr-only">6</span>&hearts;</label>
      </li>
    </ul>
  </div>
  <style-checkboxes :styles="orderedStyles" :current-styles="clothingFormData.clothingStyles" @change="updateStyleArray"></style-checkboxes>
  <style-ratings :styles="clothingFormData.clothingStyles" :current-ratings="clothingFormData.ratings" @change="updateRatings"></style-ratings>
  <tags :tags="orderedTags" @change="updateTags" :current-tags="clothingFormData.tags"></tags>
  <customization @change="updateCustomItems" @toggled="updateCustomizable"></customization>
  <button type="submit" @submit="submitClothing($event)">Submit Clothing</button>
</form>`,
  data: function() {
    return {
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
    };
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
    validateBeforeSubmit: function() {
      this.$validator.validateAll().then(function(result) {
        if (result) {
          this.submitClothing();
        }
        alert("Please fix errors");
      });
    },
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
