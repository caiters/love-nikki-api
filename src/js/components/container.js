Vue.component('container', {
  template: `
  <component v-for="category in item.children" :is="category.type" :item="category"></component>
  `,
  props: ['item']
});
