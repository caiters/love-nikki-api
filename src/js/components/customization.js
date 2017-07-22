Vue.component("customization", {
  template: `
  <fieldset>
    <legend>Customization</legend>
    <label for="customizable">Is this clothing customizable?</label>
    <div>
      <input type="radio" v-model="customizable" required name="customizable" @change="toggleCustomizable" id="customizableYes" :value="true" :checked="customizable" /> <label for="customizableYes">Yes</label>
    </div>
    <div>
      <input type="radio" v-model="customizable" required name="customizable" @change="toggleCustomizable" id="customizableNo" :value="false" :checked="customizable" /> <label for="customizableNo">No</label>
    </div>
    <div v-if="customizable">
      <div v-for="(item, index) in customizableItems" class="form-group" :class="{'form-group--error': errors.has('itemNumber'+index)}">
        <label :for="'itemNumber'+index">Item ID</label>
        <input type="text" v-validate="'required'" :name="'itemNumber'+index" :id="'itemNumber'+index" v-model="item.id" @blur="addedCustomizableItem()" placeholder="e.g. 001" /> <button type="button" @click="removeCustomizableItem(item)">x</button> <span class="form-group__error" v-if="errors.has('itemNumber'+index)">{{errors.first('itemNumber'+index)}}</span>
      </div>
      <button type="button" @click="addCustomizableItem">Add another customizable item?</button>
    </div>
  </fieldset>
  `,
  props: ["isCustomizable", "customizations"],
  data: function() {
    return {};
  },
  computed: {
    customizable: function() {
      return this.isCustomizable;
    },
    customizableItems: function() {
      return this.customizations;
    }
  },
  created: function() {
    var form = this;
    bus.$emit("componentValidateable", "customization");
    bus.$on(
      "validateForm",
      function() {
        form.$validator.validateAll().then(function(result) {
          if (result) {
            bus.$emit("componentOK");
          } else {
            bus.$emit("componentError", form.$validator.errorBag.errors);
          }
        });
      }.bind(this)
    );
    bus.$on("FormCleared", function() {
      form.customizable = false;
      form.customizableItems = [{ id: "" }];
    });
  },
  methods: {
    addCustomizableItem: function(value) {
      this.customizableItems.push({ id: "" });
    },
    removeCustomizableItem: function(itemId) {
      this.customizableItems.splice(this.customizableItems.indexOf(itemId), 1);
      if (this.customizableItems.length < 1) {
        this.customizable = false;
      }
    },
    addedCustomizableItem: function(customizableItems) {
      this.$emit("change", this.customizableItems);
    },
    toggleCustomizable: function() {
      this.$emit("toggled", this.customizable);
    }
  }
});
