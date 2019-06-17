// <option value="" disabled selected>{{ question }}</option>
// <option v-for="subject in subjectData" :value="subject.value">{{ subject.option }}</option>
//  name="FNAME"

import Vue from 'vue'
import axios from 'axios'

export default Vue.component('contact-form', {
  props: {
    url: String
  },
  data () {
    return {
      simpleFormUrl: 'https://getsimpleform.com/messages?form_api_token=',
      token: '9e785bffbf9337d08052b2b07bb8ef67',
      testToken: 'd785a1918d67317a7cd4f65c805f1c61',
      formContent: {},
      sent: false,
      subscribed: false
    }
  },
  methods: {
    submitForm (event) {
      event.preventDefault()
      axios.post(
        `${this.simpleFormUrl}${this.token}`, 
        this.formContent
      ).then(response => {
        console.log(`${response.status}: ${response.statusText}`)
      })
      this.sent = true
    }
  },
  template: `
    <div>
      <form v-if="!sent" action="#">

        <!-- contact form -->
        <div class="control_group">
          <label for="name">Your Name</label>
          <input 
            v-model="formContent.name"
            type="text"
            class="form-textbox"
            id="contact-name"
            size="20"
            value=""
            required
          />
        </div>
        <div class="control_group">
          <label for="email">Your Email</label>
          <input
            v-model="formContent.email"
            type="email"
            class="form-textbox"
            id="contact-email"
            size="20"
            value=""
            required
          />
        </div>
        <div class="control_group">
        <select
          v-model="formContent.subject"
          class="form-dropdown"
          id="contact-subject"
        >
          <slot name="subject-options"></slot>
        </select>
        </div>
        <div class="control_group">
          <label for="message">Your Message</label>
          <textarea
            v-model="formContent.message"
            id="contact-message"
            class="form-textarea"
            cols="40"
            rows="6"
            required
          ></textarea>
        </div>
        <input type="hidden" class="form-hidden" :value="url" id="contact-url" name="url" />
        <div class="control_group mailing-list">
          <input type="checkbox" id="contact-mailing-list" value="opted-in" />
          <label for="mailing-list">Add me to <strong>The Petting Zoo's</strong> mailing&nbsp;list.</label>
        </div>
        <button
          @click="submitForm"
          id="contact-contact-submit"
          type="submit"
          class="button primary small">
            Send
          </button>
      </form>
      
      <!-- Mailchimp/newsletter form -->
      <form id="contact-mc-form" style="display:none;">
        <input id="contact-mc-email" type="email" placeholder="email">
        <label for="mc-email"></label>
        <input type="text" value="" class="" id="contact-mc-FNAME">
        <label for="mc-FNAME"></label>
        <button type="submit">Submit</button>
      </form>
      
      <!-- Contact info sidebar -->
      <aside v-if="!sent" class="meta contact">
        <slot></slot>
      </aside>
      
      <div v-if="sent" class="sent">
        <!-- Success message -->
        <h3>Thanks for contacting us!</h3>
        <p class="center">We'll be in touch with you soon.</p>
        <p v-if="subscribed" class="t-align-center">
          Thank you for subscribing to our mailing list. We have sent you a confirmation email.
        </p>
      </div>
    </div>
  `
})