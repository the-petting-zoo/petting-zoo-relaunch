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
    buttonStyles: String,
    icon: String
  },
  data() {
    return {
      open: false
    }
  },
  computed: {
    buttonAttributes() {
      return `${this.icon ? 'has-icon both' : 'has-icon'}${this.open ? ' active': ''}`
    }
  },
  template: `
    <div class="display-inline-block position-relative">
      <button
        :data-ui-button-incognito="buttonAttributes"
        @click="open = !open"
        :aria-expanded="open ? 'true' : 'false'"
        :class="buttonStyles"
      >
        <svg v-if="icon" data-ui-icon data-ui-button-icon role="presentation">
          <use :xlink:href="'#' + icon"></use>
        </svg>
        {{ label }}
        <svg data-ui-icon data-ui-button-icon role="presentation">
          <use :xlink:href="open ? '#arrow-up' : '#arrow-down'"></use>
        </svg>
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