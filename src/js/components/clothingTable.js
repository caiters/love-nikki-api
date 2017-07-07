var clothingTable = Vue.component("clothing-table", {
  template: `
  <div class="clothing-table">
    <category-select :categories="categories" @change="updateCategory"></category-select>
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Clothing Name</th>
          <th>Hearts</th>
          <th>Styles</th>
          <th>Tags</th>
          <th>Customizable?</th>
          <th>Customizes to...</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="clothing in clothes">
          <td>{{clothing.category}}</td>
          <td>{{clothing.name}}</td>
          <td>{{clothing.hearts}}</td>
          <td>
            <ul>
              <li v-for="(style, index) in clothing.style">
                {{index}}: {{style.toUpperCase()}}
              </li>
            </ul>
          </td>
          <td>{{clothing.tags}}</td>
          <td>{{clothing.customizable}}</td>
          <td><span v-for="(customization, index) in clothing.customizations">{{customization}}, </span></td>
        </tr>
      </tbody>
    </table>
  </div>`,
  data: function() {
    return {
      selectedCategory: ""
    };
  },
  computed: {
    clothes: function() {
      var clothes = store.state.clothes;
      return this.filterByCategory(clothes, this.selectedCategory);
    },
    categories: function() {
      return store.state.categories;
    }
  },
  methods: {
    filterByCategory: function(clothes, category) {
      if (category.length > 0) {
        return _.pickBy(clothes, function(value) {
          return value.category === category;
        });
      }
      return clothes;
    },
    updateCategory: function(chosenCategory) {
      this.selectedCategory = chosenCategory;
    }
  }
});
