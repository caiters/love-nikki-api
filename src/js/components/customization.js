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
      <div v-for="(item, index) in customizableItems">
        <label :for="'itemNumber'+index">Item ID</label>
        <input type="text" :name="'itemNumber'+index" :id="'itemNumber'+index" v-model="item.id" @blur="addedCustomizableItem()" placeholder="e.g. 001" />
      </div>
      <button type="button" @click="addCustomizableItem">Add another customizable item?</button>
    </div>
  </fieldset>
  `,
  data: function() {
    return {
      customizable: false,
      customizableItems: [{ id: "" }]
    };
  },
  methods: {
    addCustomizableItem: function(value) {
      this.customizableItems.push({ id: "" });
    },
    addedCustomizableItem: function(customizableItems) {
      this.$emit("change", this.customizableItems);
    },
    toggleCustomizable: function() {
      this.$emit("toggled", this.customizable);
    }
  }
});
