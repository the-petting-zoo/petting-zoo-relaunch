import Vue from 'vue'

export default Vue.component('contact-form', {
  props: {
    url: String,
    question: Array,
    subjects: Array
  },
  data() {
    return {
      simpleFormToken: '9e785bffbf9337d08052b2b07bb8ef67',
      simpleFormUrl: `http://getsimpleform.com/messages/ajax?form_api_token=${this.data.simpleFormToken}`,
      success: false
    }
  },
  template: `
    <div>
      <form v-if="!success" action="#">
        <div class="control_group">
          <label for="name">Your Name</label>
          <input type="text" class="form-textbox" data-type="input-textbox" id="name" name="name" size="20" value="" required/>
        </div>
        <div class="control_group">
          <label for="email">Your Email</label>
          <input type="email" class="form-textbox" data-type="input-textbox" id="email" name="email" size="20" value="" required/>
        </div>
        <div class="control_group">
        <select class="form-dropdown" id="subject" name="subject">
          <option value="" disabled selected>{{ question }}</option>
          <option
            v-for="subject in subjects" 
            value="{{ subject.value }}"
          >
            {{ subject.option }}
          </option>
        </select>
        </div>
        <div class="control_group">
          <label for="message">Your Message</label>
          <textarea id="message" class="form-textarea" name="message" cols="40" rows="6" required></textarea>
        </div>
        <input type="hidden" class="form-hidden" value="{{ url }}" id="url" name="url" />
        <div class="control_group mailing-list">
          <input type="checkbox" id="mailing-list" name="mailing-list" value="opted-in" />
          <label for="mailing-list">Add me to <strong>The Petting Zoo's</strong> mailing&nbsp;list.</label>
        </div>
        <button name="contact-submit" id="contact-submit" type="submit" class="button primary small">Send</button>
      </form>

      <form id="mc-form" style="display:none;">
        <input id="mc-email" type="email" name="mc-email" placeholder="email">
        <label for="mc-email"></label>
        <input type="text" value="" name="FNAME" name="mc-fname" class="" id="mc-FNAME">
        <label for="mc-FNAME"></label>
        <button type="submit">Submit</button>
      </form>

      <aside v-if="!success" class="meta contact">
        <slot></slot>
      </aside>

      <div v-if="success" class="success">
        <h3>Thanks for contacting us!</h3>
        <p class="center">We'll be in touch with you soon.</p>
      </div>

      <p v-if="success" class="center">
        Thank you for subscribing to our mailing list. We have sent you a confirmation email.
      </p>
    </div>
  `
})