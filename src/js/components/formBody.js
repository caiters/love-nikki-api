var formBody = Vue.component("form-body", {
  template: `
  <div>
    <div class="form-group" :class="{'form-group--error': errors.has('name')}">
      <label class="form-group__label" for="name">Name</label>
      <input class="form-group__input" required type="text" name="name" id="name" v-validate="'required'" v-model="clothingFormData.name" placeholder="e.g. Nikki's Pinky" @change="change" />
      <span class="form-group__error" v-if="errors.has('name')">{{errors.first('name')}}</span>
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
  </div>
  `,
  props: ["clothing"],
  data: function() {
    return {
      finished: false,
      clothingFormData: _.cloneDeep(this.clothing),
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
    store.dispatch("load");
  },
  computed: {
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
    change: function() {
      this.$emit("changeFormBody", this.clothingFormData);
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
    }
  }
});
