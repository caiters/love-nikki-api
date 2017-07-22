Vue.component("tags", {
  template: `
  <fieldset class="style-form__checkbox-wrapper">
    <legend class="style-form__checkbox-title">Select tags</legend>
    <div v-for="tag in tags" class="style-form__checkbox-container" style="width: 15%; float: left;">
      <input type="checkbox" v-bind:name="tag" @change="addedTag" v-model="selectedTags" :value="tag" v-bind:id="'selectTags' + tag" /> <label v-bind:for="'selectTags' + tag">{{tag}}</label>
    </div>
  </fieldset>
  `,
  props: ["tags", "currentTags"],
  data: function() {
    return {
      //selectedTags: this.currentTags
    };
  },
  computed: {
    selectedTags: function() {
      return this.currentTags;
    }
  },
  created: function() {
    var form = this;
    bus.$on("FormCleared", function() {
      form.selectedTags = [];
    });
  },
  methods: {
    addedTag: function() {
      this.$emit("change", this.selectedTags);
    }
  }
});
