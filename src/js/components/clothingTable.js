var clothingTable = Vue.component("clothing-table", {
  template: `
  <div class="clothing-table">
    <category-select :categories="categories" :current-category="selectedCategory" @change="updateCategory"></category-select>
    <style-checkboxes :styles="orderedStyles" @change="updateStyleArray" :current-styles="selectedStyles"></style-checkboxes>
    <tags :tags="orderedTags" @change="updateTags" :current-tags="selectedTags"></tags>
    {{selectedTags}}
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
          <th>Delete?</th>
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
          <td valign="top">
            <button type="button" @click="deleteClothing(clothing.category, clothing.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>`,
  data: function() {
    return {
      selectedCategory: "",
      selectedStyles: [],
      selectedTags: []
    };
  },
  computed: {
    clothes: function() {
      console.log("refreshing clothing");
      var clothes = store.state.clothes;
      clothes = this.filterByCategory(clothes, this.selectedCategory);
      clothes = this.filterByStyle(clothes, this.selectedStyles);
      clothes = this.filterByTags(clothes, this.selectedTags);
      return clothes;
    },
    categories: function() {
      return store.state.categories;
    },
    orderedStyles: function() {
      //console.log(store.state.styles);
      return store.state.styles.sort();
    },
    orderedTags: function() {
      return store.state.tags.sort();
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
    filterByStyle: function(clothes, styleArray) {
      if (styleArray.length > 0) {
        return _.pickBy(clothes, function(item, itemId) {
          var keys = Object.keys(item.style);
          _.pullAll(keys, styleArray);
          if (keys.length <= 5 - styleArray.length) {
            return item;
          }
        });
      }
      return clothes;
    },
    filterByTags: function(clothes, tagsArray) {
      var currentTags = tagsArray.slice();
      if (currentTags.length > 0) {
        return _.pickBy(clothes, function(item) {
          if (item.tags.length > 0) {
            var numTags = currentTags.length;
            _.pullAll(currentTags, item.tags);
            if (currentTags.length < numTags) {
              return item;
            }
          }
        });
        return clothes;
      }
      return clothes;
    },
    updateCategory: function(chosenCategory) {
      this.selectedCategory = chosenCategory;
    },
    updateStyleArray: function(chosenStyles) {
      this.selectedStyles = chosenStyles;
    },
    deleteClothing: function(category, id) {
      store.dispatch("deleteClothingItem", { category: category, id: id });
    },
    updateTags: function(chosenTags) {
      console.log(chosenTags, "chosen tags");
      this.selectedTags = chosenTags;
      console.log(this.selectedTags, "this.selectedTags");
      console.log(chosenTags, "chosenTags");
    }
  }
});
