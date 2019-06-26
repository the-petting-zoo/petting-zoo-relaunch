import Vue from 'vue'
import axios from 'axios'

export default Vue.component('contact-form', {
  props: {
    url: String
  },
  data () {
    return {
      simpleForm: {
        url: 'https://getsimpleform.com/messages?form_api_token=',
        token: '9e785bffbf9337d08052b2b07bb8ef67',
        testToken: 'd785a1918d67317a7cd4f65c805f1c61'
      },
      mailChimpUrl: 'http://pettingzooplush.us8.list-manage.com/subscribe/post?u=63768868a43809514e63f3953&id=0caa307af8',
      formContent: {},
      sent: false,
      subscribed: false
    }
  },
  methods: {
    submitForm (event) {
      event.preventDefault()
      axios.post(
        `${this.simpleForm.url}${this.simpleForm.token}`, 
        this.formContent
      ).then(response => {
        console.log(`${response.status}: ${response.statusText}`)
        if (this.subscribed) {
          this.subscribe()
        }
      })
      this.sent = true
    },
    subscribe () {
      // not sure if this is the correct data to send to MC - @scott can you double check against API v3?
      axios.post(this.mailChimpUrl, {
        'email_address': this.formContent.email,
        'status': 'subscribed',
        'merge_fields': {
          'mc-FNAME': this.formContent.name.split(' ')[0],
          'mc-LNAME': this.formContent.name.split(' ')[1]
        }
      }).then(response => {
        console.log(`${response.status}: ${response.statusText}`)
      })
    }
  },
  template: `
    <div>
      <form v-if="!sent" action="#">

        <!-- contact form -->
        <div class="padding-bottom-xnarrow">
          <label class="form-label padding-bottom-xnarrow" for="name">Your name</label>
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
        <div class="padding-bottom-xnarrow">
          <label class="form-label padding-bottom-xnarrow" for="email">Your email</label>
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
        <div class="padding-bottom-xnarrow">
          <label class="form-label padding-bottom-xnarrow" for="email">How can we help?</label>
          <select
            v-model="formContent.subject"
            class="form-dropdown"
            id="contact-subject"
          >
            <slot></slot>
          </select>
        </div>
        <div class="padding-bottom-xnarrow">
          <label class="form-label padding-bottom-xnarrow" for="message">Your message</label>
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
        <div class="padding-bottom-xnarrow mailing-list">
          <input
            v-model="subscribed"
            type="checkbox"
            id="contact-mailing-list"
            class="form-checkbox"
          />
          <label class="form-label display-inline-block padding-left-xxnarrow padding-bottom-xnarrow" for="mailing-list">Add me to <strong>The Petting Zoo's</strong> mailing list.</label>
        </div>
        <button
          @click="submitForm"
          data-ui-button="primary"
          id="contact-submit"
          type="submit"
        >
          Send
        </button>
      </form>
      
      <!-- Mailchimp/newsletter form -->
      <!-- this can probably go away since we're using Vue -->
      <form id="mc-form" style="display:none;">
        <input id="mc-email" type="email" placeholder="email">
        <label class="form-label padding-bottom-xnarrow" for="mc-email"></label>
        <input type="text" value="" class="" id="mc-FNAME">
        <label class="form-label padding-bottom-xnarrow" for="mc-FNAME"></label>
        <button type="submit">Submit</button>
      </form>

      <!-- Success message -->
      <div v-if="sent" class="t-align-center border border-round padding">
        <h3 class="t-scale-beta padding-bottom-xnarrow">Thanks for contacting us!</h3>
        <p>We'll be in touch with you soon.</p>
        <p v-if="subscribed && sent" class="padding-top-narrow margin-top-narrow border-top c-text-tertiary">
          Thank you for subscribing to our mailing list. We have sent you a confirmation email.
        </p>
      </div>
    </div>
  `
})