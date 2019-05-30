import Vue from 'vue'

export default Vue.component('button-dropdown', {
  props: {
    label: String
  },
  data() {
    return {
      open: true
    }
  },
  template: `
    <div class="display-inline-block position-relative">
      <button
        data-ui-button-incognito
        @click="open = !open"
        :aria-expanded="open ? 'true' : 'false'"
      >
        {{ label }}
      </button>
      <div
        v-show="open"
       data-ui-button-dropdown
       data-theme-default
       class="margin-top-xnarrow padding-xnarrow se-shadow"
      >
        <slot></slot>
      </div>
    </div>
  `
})