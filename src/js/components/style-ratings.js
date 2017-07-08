Vue.component("style-ratings", {
  template: `
  <fieldset>
    <legend>Give ratings for selected styles</legend>
    <div v-if="styles.length < 5">
      <p>Select 5 styles above.</p>
    </div>
    <div v-if="styles.length === 5" v-for="style in styles">
      <label :for="'rating' + style">{{style}}</label>
      <input type="text" required maxlength="3" :id="'rating' + style" :name="'rating' + style" v-model="styleRatings[style]" @blur="addedRating" v-validate="{ rules: { required:true, regex: /^([Ss]{2}|[ABCSabcs])$/ }}" />
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
