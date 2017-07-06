Vue.component('category', {
  template: `
  <option :value="item.name.replace(/&nbsp;/gi,'')" v-html="item.name" :disabled="item.type === 'container'"></option>
  `,
  props: ['item']
});
