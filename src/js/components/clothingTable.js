var clothingTable = Vue.component("clothing-table", {
  template: `
  <div class="clothing-view">
    <div class="form-group">
      <label class="form-group__label" for="filterID">Filter by ID:</label>
      <input class="form-group__input" id="filterID" name="filterID" v-model="filterID" type="text" />
    </div>
    <category-select :categories="categories" :current-category="selectedCategory" @change="updateCategory"></category-select>
    <style-checkboxes :styles="orderedStyles" @change="updateStyleArray" :current-styles="selectedStyles"></style-checkboxes>
    <tags :tags="orderedTags" @change="updateTags" :current-tags="selectedTags"></tags>

    <p>Showing {{clothesFilteredTotal}}/{{clothesTotal}} clothes</p>
    <table class="clothing-table">
      <thead class="clothing-table__head">
        <tr class="clothing-table__row clothing-table__row--head">
          <th class="clothing-table__cell clothing-table__header">Category</th>
          <th class="clothing-table__cell clothing-table__header">ID</th>
          <th class="clothing-table__cell clothing-table__header">Clothing Name</th>
          <th class="clothing-table__cell clothing-table__header">Hearts</th>
          <th class="clothing-table__cell clothing-table__header">Styles</th>
          <th class="clothing-table__cell clothing-table__header">Tags</th>
          <!--<th class="clothing-table__cell clothing-table__header">Customizable?</th>-->
          <th class="clothing-table__cell clothing-table__header">Customizes to...</th>
          <th class="clothing-table__cell clothing-table__header">Edit?</th>
          <th class="clothing-table__cell clothing-table__header">Delete?</th>
        </tr>
      </thead>
      <tbody class="clothing-table__body">
        <tr v-for="clothing in clothes" :id="clothing.category + '-' + clothing.id" class="clothing-table__row" :key="clothing.category + '-' + clothing.id">
          <td class="clothing-table__cell" valign="top">{{clothing.category}}</td>
          <td class="clothing-table__cell" valign="top">{{clothing.id}}</td>
          <td class="clothing-table__cell" valign="top">{{clothing.name}}</td>
          <td class="clothing-table__cell" valign="top"><span v-for="heart in clothing.hearts">&hearts;</span></td>
          <td class="clothing-table__cell" valign="top">
            <ul class="clothing-table__style-list style-list">
              <li v-for="(style, index) in clothing.style" :class="'style-list__item style ' + 'style--' + index.toLowerCase()">
                {{index}}: {{style.toUpperCase()}}
              </li>
            </ul>
          </td>
          <td class="clothing-table__cell" valign="top">
            <ul class="tags-list">
              <li class="tags-list__item tag" v-for="(tag, index) in clothing.tags">
                {{tag}}
              </li>
            </ul>
          </td>
          <!--<td class="clothing-table__cell" valign="top">{{clothing.customizable}}</td>-->
          <td class="clothing-table__cell" valign="top"><span v-for="(customization, index) in clothing.customizations">{{customization}}, </span></td>
          <td class="clothing-table__cell" valign="top">
            <router-link :to="'/' + clothing.id + '/' + clothing.category + '/edit'">Edit</router-link>
          </td>
          <td class="clothing-table__cell" valign="top">
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
      selectedTags: [],
      filterID: ""
    };
  },
  computed: {
    clothes: function() {
      var clothes = store.state.clothes;
      clothes = this.filterByCategory(clothes, this.selectedCategory);
      clothes = this.filterByID(clothes, this.filterID);
      clothes = this.filterByStyle(clothes, this.selectedStyles);
      clothes = this.filterByTags(clothes, this.selectedTags);
      var clothesArray = _.sortBy(clothes, ["category", "id"]);
      return clothesArray;
    },
    clothesFilteredTotal: function() {
      return Object.keys(this.clothes).length;
    },
    clothesTotal: function() {
      var clothes = store.state.clothes;
      return Object.keys(clothes).length;
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
      if (category && category.length > 0) {
        return _.pickBy(clothes, function(value) {
          return value.category === category;
        });
      }
      return clothes;
    },
    filterByID: function(clothes, filterID) {
      if (filterID && filterID.length === 3) {
        return _.pickBy(clothes, function(value) {
          return value.id === filterID;
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
    editClothing: function(category, id) {
      //asdf
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
