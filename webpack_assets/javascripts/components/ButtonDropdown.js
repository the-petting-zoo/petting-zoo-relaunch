import Vue from 'vue'

export default Vue.component('button-dropdown', {
  props: {
    label: String
  },
  data() {
    return {
      show: false
    }
  },
  template: `
    <div>
      <button
        @click="show = !show"
        :aria-expanded="show ? 'true' : 'false'"
      >
        {{ label }}
      </button>
      <div v-if="show">
        <slot></slot>
      </div>
    </div>
  `
})