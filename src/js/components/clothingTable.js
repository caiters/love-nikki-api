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
        <tr v-for="clothing in clothes" :id="clothing.category + '-' + clothing.id" class="clothing-table__row" :key="clothing.category + '-' + clothing.id" v-show="shouldShow(clothing)">
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
      return _.sortBy(clothes, ["category", "id"]);
    },
    clothesFilteredTotal: function() {
      var form = this;
      return _.reduce(
        form.clothes,
        function(currentTotal, clothingItem) {
          return currentTotal + (form.shouldShow(clothingItem) ? 1 : 0);
        },
        0
      );
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
    shouldShow: function(clothing) {
      var form = this;

      // check styles
      if (form.selectedStyles.length > 0) {
        var keys = Object.keys(clothing.style);
        console.log(_.intersection(form.selectedStyles, keys).length);
        if (
          _.intersection(form.selectedStyles, keys).length !==
          form.selectedStyles.length
        ) {
          return false;
        }
      }

      // check tags
      if (form.selectedTags.length > 0) {
        var currentTags = form.selectedTags.slice();
        var numTags = currentTags.length;
        _.pullAll(currentTags, form.selectedTags);
        if (!(currentTags.length < numTags)) {
          return false;
        }
      }

      // check category
      if (form.selectedCategory.length > 0) {
        if (clothing.category !== form.selectedCategory) {
          return false;
        }
      }

      // check id
      if (form.filterID.length > 2) {
        if (clothing.id !== form.filterID) {
          return false;
        }
      }
      return true;
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
      this.selectedTags = chosenTags;
    }
  }
});
