import { html, LitElement, nothing } from "lit";
import styles from "./index.styles";

/**
 * @element cloudy-sky
 * @summary Beautify your content with some nature.
 *
 * @slot - Default slot for anything you want.
 *
 * @attr {Boolean} hillside - Transport your content to a scenic field.
 * @attr {Number} button-size - Change the block/inline size of the action button.
 *
 * @prop {Boolean} _active - Cloud state: on or off.
 * @prop {String} buttonPixels - Take the supplied button size and turn it into a pixel string.
 *
 * @csspart hillside - The SVG of the hill.
 * 
 * @cssprop --cloud-foreground - A valid CSS background image value to replace the foreground clouds.
 * @cssprop --cloud-background - A valid CSS background image value to replace the background clouds.
 * @cssprop --cloud-filter - Change the CSS filter on your clouds.
 */
export class CloudySky extends LitElement {
  static styles = styles;

  static get properties() {
    return {
      buttonSize: { type: Number, attribute: "button-size" },
      hillside: { type: Boolean },
      _active: { state: true },
    };
  }

  constructor() {
    super();
    this.buttonSize = 24;
    this.hillside = false;
    this._active = false;
  }

  get buttonPixels() {
    return `${this.buttonSize}px`;
  }

  #setClouds() {
    this._active = !this._active;
  }

  firstUpdated() {
    /** Clouds appear by an intersection observer to avoid animations before it enters view. */
    const _intersectionObserver = (entries) => {
      entries.map((entry) => {
        if (entry.isIntersecting) {
          this.#setClouds();
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(_intersectionObserver);
    observer.observe(this);
  }

  renderCloudCoverage() {
    return html`<div class="cloud foreground"></div>
      <div class="cloud background"></div>
      <div class="cloud foreground"></div>
      <div class="cloud background"></div>
      <div class="cloud foreground"></div>
      <div class="cloud background"></div>
      <div class="cloud background"></div>
      <div class="cloud foreground"></div>
      <div class="cloud background"></div>
      <div class="cloud background"></div>`;
  }

  renderSun(size) {
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>`;
  }

  renderMoon(size) {
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="${size}"
      height="${size}"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>`;
  }

  renderHillside() {
    return html`<svg
      class="hillside"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 720 80">
      <path d="M0,80V47.6C0,47.6,333,0,503,0c166,0,217,24.3,217,24.3V80H0z" part="hillside" />
    </svg>`;
  }

  render() {
    return html` <div class="wrapper shell">
      <div data-clouds class="${!this._active ? "sunset" : nothing}">
        ${this.renderCloudCoverage()}
      </div>
      <div class="wrapper sundialWrapper" style="block-size: ${this.buttonPixels}">
        <button
          title="Turn the clouds on or off."
          type="button"
          name="sundial"
          class="sundial sun"
          @click="${this.#setClouds}">
          ${this._active ? this.renderSun(this.buttonPixels) : this.renderMoon(this.buttonPixels)}
        </button>
      </div>
      <div class="wrapper slotArea">
        <slot></slot>
      </div>
      ${this.hillside ? this.renderHillside() : nothing}
    </div>`;
  }
}

customElements.define("cloudy-sky", CloudySky);
