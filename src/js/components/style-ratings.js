var customValidationMsgs = {
  en: {
    custom: {
      ratingMature: {
        regex: "Please give a letter grade - SS, S, A, B, or C"
      }
    }
  }
};

Vue.component("style-ratings", {
  template: `
  <fieldset>
    <legend>Give ratings for selected styles</legend>
    <div v-if="styles.length < 5">
      <p>Select 5 styles above.</p>
    </div>
    <div v-if="styles.length === 5" v-for="style in styles">
      <label :for="'rating' + style">{{style}}</label>
      <input type="text" maxlength="3" :id="'rating' + style" :name="'rating' + style" v-model="styleRatings[style]" @blur="addedRating" v-validate="{ rules: { regex: /^[SSss]{2}|[ABCSabcs]{1,2}$/ }}" />
      <span v-show="errors.has('rating' + style)">{{ errors.first('rating' + style)}}</span>
    </div>
  </fieldset>
  `,
  props: ["styles", "currentRatings"],
  data: function() {
    return {
      styleRatings: this.currentRatings
    };
  },
  methods: {
    addedRating: function() {
      this.$emit("change", this.styleRatings);
    }
  }
});
