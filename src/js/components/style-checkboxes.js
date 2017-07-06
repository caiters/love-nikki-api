Vue.component("style-checkboxes", {
  template: `
  <fieldset class="style-form__checkbox-wrapper">
    <legend class="style-form__checkbox-title">Select styles</legend>
    <div v-for="style in styles" class="style-form__checkbox-container">
      <input :disabled="shouldBeDisabled(style)" @change="checkedItem(selectedStyles)" v-model="selectedStyles" type="checkbox" :value="style" :name="style" :id="'selectStyles' + style" />
      <label v-bind:for="'selectStyles' + style" v-bind:class="'style style--' + style.toLowerCase()">{{style}}</label>
    </div>
  </fieldset>
  `,
  props: ["styles", "currentStyles"],
  data: function() {
    return {
      selectedStyles: this.currentStyles
    };
  },
  methods: {
    checkedItem: function(styles) {
      this.$emit("change", styles);
    },
    shouldBeDisabled: function(value) {
      if (this.selectedStyles.indexOf(value) > -1) {
        return false;
      }
      return this.selectedStyles.length >= 5;
    }
  }
});
