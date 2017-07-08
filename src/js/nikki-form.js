var routes = [
  { path: "/", component: clothingTable },
  { path: "/add-clothing", component: clothingForm }
];

var router = new VueRouter({
  routes: routes
});

var app = new Vue({
  el: "#nikki",
  router: router,
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
    }
  },
  methods: {
    updateStyleArray: function(value) {
      this.clothingFormData.clothingStyles = value;
    }
  }
}).$mount("#nikki");
app.$validator.updateDictionary(customValidationMsgs);
