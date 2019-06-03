import Vue from 'vue'
import VueInstagram from 'vue-instagram'

export default Vue.component('instagram-feed', {
  components: {
    VueInstagram
  },
  template: `
    <ul data-ui-gallery style="--gutter: var(--space-xnarrow);">
      <vue-instagram
        token=""
        :count="10"
        :tags="['shareandsmile']"
        mediaType="image"
      >
        <template slot="feeds" slot-scope="props">
          <li data-ui-gallery-item>
            <a :href="props.feed.link">
              <img :src="props.feed.images.low_resolution.url" alt="ShareAndSmile image">
            </a>
          </li>
        </template>
      </vue-instagram>
    </ul>
  `
})