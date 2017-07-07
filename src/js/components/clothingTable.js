var clothingTable = Vue.component("clothing-table", {
  template: `
  <div class="clothing-table">
    <category-select :categories="categories" @change="updateCategory"></category-select>
    <table class="clothing-table__table">
      <thead>
        <tr>
          <th>Category</th>
          <th>ID</th>
          <th>Clothing Name</th>
          <th>Hearts</th>
          <th>Styles</th>
          <th>Tags</th>
          <th>Customizable?</th>
          <th>Customizes to...</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="clothing in clothes" :id="clothing.category + '-' + clothing.id">
          <td valign="top">{{clothing.category}}</td>
          <td valign="top">{{clothing.id}}</td>
          <td valign="top">{{clothing.name}}</td>
          <td valign="top"><span v-for="heart in clothing.hearts">&hearts;</span></td>
          <td valign="top">
            <ul class="clothing-table__style-list style-list">
              <li v-for="(style, index) in clothing.style" :class="'style-list__item style ' + 'style--' + index.toLowerCase()">
                {{index}}: {{style.toUpperCase()}}
              </li>
            </ul>
          </td>
          <td valign="top">
            <ul class="tags-list">
              <li class="tags-list__item tag" v-for="(tag, index) in clothing.tags">
                {{tag}}
              </li>
            </ul>
          </td>
          <td valign="top">{{clothing.customizable}}</td>
          <td valign="top"><span v-for="(customization, index) in clothing.customizations">{{customization}}, </span></td>
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
