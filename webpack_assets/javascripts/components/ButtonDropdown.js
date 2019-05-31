import Vue from 'vue'

export default Vue.component('button-dropdown', {
  props: {
    label: String,
    position: {
      default: 'center',
      type: String,
      validator(value) {
        return ['center', 'right'].indexOf(value) !== -1
      }
    },
    buttonStyles: String
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
        :class="buttonStyles"
      >
        {{ label }}
      </button>
      <div
        v-show="open"
       :data-ui-button-dropdown="position === 'center' ? '' : position"
       data-theme-default
       class="margin-top-xnarrow padding-xnarrow se-shadow t-align-center"
      >
        <slot></slot>
      </div>
    </div>
  `
})