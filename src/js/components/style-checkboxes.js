Vue.component("style-checkboxes", {
  template: `
  <fieldset class="style-form__checkbox-wrapper">
    <legend class="style-form__checkbox-title">Select styles</legend>
    <p class="form-group__error" v-if="(!errors.has('selectedStylesNum') && (fields.selectedStylesNum && !fields.selectedStylesNum.valid)) || !componentValidated">Please select 5 styles.</p>
    <p class="form-group__error" style="color:red" v-if="errors.has('selectedStylesNum') && componentValidated">{{errors.first('selectedStylesNum')}}</p>
    <p class="form-group__message" v-if="fields.selectedStylesNum && fields.selectedStylesNum.valid">5 styles selected.</p>
    <div v-for="style in styles" class="style-form__checkbox-container">
      <input :disabled="shouldBeDisabled(style)" @change="checkedItem(selectedStyles)" v-model="selectedStyles" type="checkbox" :value="style" :name="style" :id="'selectStyles' + style" />
      <label v-bind:for="'selectStyles' + style" v-bind:class="'style style--' + style.toLowerCase()">{{style}}</label>
    </div>
    <input v-model="selectedStyles.length" name="selectedStylesNum" type="hidden" id="selectedStylesNum" v-validate="'required|min_value:5|max_value:5'" min="5" max="5" required disabled />

  </fieldset>
  `,
  props: ["styles", "currentStyles", "error"],
  data: function() {
    return {
      selectedStyles: this.currentStyles,
      componentValidated: false
    };
  },
  watch: {
    currentStyles: function(newStyles) {
      this.selectedStyles = newStyles;
    }
  },
  created: function() {
    var form = this;
    bus.$emit("componentValidateable", "style checkboxes");
    bus.$on("validateForm", function() {
      form.$validator.validateAll().then(function(result) {
        form.componentValidated = true;
        if (result) {
          bus.$emit("componentOK");
        } else {
          bus.$emit("componentError", form.$validator.errorBag.errors);
        }
      });
    });
    bus.$on("FormCleared", function() {
      form.selectedStyles = [];
      form.componentValidated = false;
    });
  },
  methods: {
    checkedItem: function(styles) {
      this.$emit("change", styles);
    },
    shouldBeDisabled: function(value) {
      if (typeof this.selectedStyles === "undefined") {
        return false;
      }
      if (this.selectedStyles.indexOf(value) > -1) {
        return false;
      }
      return this.selectedStyles.length >= 5;
    }
  }
});
