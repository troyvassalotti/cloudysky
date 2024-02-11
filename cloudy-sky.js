import { html, LitElement, nothing, css } from "lit";
import { map } from "lit/directives/map.js";

/**
 * @element cloudy-sky
 * @summary Beautify your content with some nature.
 *
 * @slot - Default slot for anything you want.
 *
 * @attr {Boolean} hillside - Transport your content to a scenic field.
 * @attr {Number} button-size - Change the block/inline size of the action button.
 * @attr {Number} cloud-count - Set the number of clouds in the sky.
 *
 * @prop {Boolean} _active - Cloud state: on or off.
 * @prop {String} buttonPixels - Take the supplied button size and turn it into a pixel string.
 *
 * @csspart hillside - The SVG of the hill.
 * @csspart sundial - SVG of the button.
 * @csspart sundial-button - Button element housing the svg.
 * @csspart shell - Outermost wrapper of the shadow DOM.
 * @csspart wrapper - Slotted area content wrapper.
 * @csspart clouds - Container for all the cloud coverage.
 *
 * @cssprop --cloud-fill-foreground-light - A valid CSS color for the foreground clouds in light color scheme.
 * @cssprop --cloud-fill-foreground-dark - A valid CSS color for the foreground clouds in dark color scheme.
 * @cssprop --cloud-fill-background-light - A valid CSS color for the background clouds in light color scheme.
 * @cssprop --cloud-fill-background-dark - A valid CSS color for the background colors in dark color scheme.
 * @cssprop --hillside-fill-light - A valid CSS color for the hillside in light color scheme.
 * @cssprop --hillside-fill-dark - A valid CSS color for the hillside in dark color scheme.
 * @cssprop --sundial-layer - A z-index value for the sundial, if necessary.
 */
export default class CloudySky extends LitElement {
  constructor() {
    super();
    this.buttonSize = 24;
    this.cloudCount = 10;
    this.hillside = false;
    this._active = false;
  }

  static get properties() {
    return {
      buttonSize: { type: Number, attribute: "button-size" },
      cloudCount: { type: Number, attribute: "cloud-count" },
      hillside: { type: Boolean },
      _active: { state: true },
    };
  }

  static styles = css`
    :host {
      --cloud-fill-foreground-dark: #ff7200;
      --cloud-fill-foreground-light: #3187cc;
      --cloud-fill-background-dark: #fcb314;
      --cloud-fill-background-light: #3460c0;
      --hillside-fill-light: hsl(145, 63%, 42%);
      --hillside-fill-dark: hsl(220, 7.2%, 40%);

      box-sizing: border-box;
      display: block;
    }

    :host([force-color-scheme="light"]) {
      --hillside-fill-dark: var(--hillside-fill-light);
      --cloud-fill-foreground-dark: var(--cloud-fill-foreground-light);
      --cloud-fill-background-dark: var(--cloud-fill-background-light);
    }

    :host([force-color-scheme="dark"]) {
      --hillside-fill-light: var(--hillside-fill-dark);
      --cloud-fill-background-light: var(--cloud-fill-background-dark);
      --cloud-fill-foreground-light: var(--cloud-fill-foreground-dark);
    }

    *,
    *::after,
    *::before {
      box-sizing: inherit;
    }

    .hillside {
      display: block;
    }

    .hillside path {
      fill: var(--hillside-fill-light);
    }

    @media (prefers-reduced-motion: reduce) {
      .sundial {
        display: none;
      }
    }

    @media (prefers-reduced-motion: no-preference) {
      .wrapper {
        position: relative;
      }

      .slotArea {
        z-index: 3;
      }

      .sunset {
        display: none;
      }

      .sundial {
        background: transparent;
        border: none;
        color: currentColor;
        cursor: pointer;
        inset-block-start: 0;
        inset-inline-end: 0;
        padding-block: 0;
        padding-inline: 1ch;
        position: absolute;
        z-index: var(--sundial-layer, 10);
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }

        to {
          opacity: 1;
        }
      }

      @keyframes float {
        from {
          transform: translateX(100%) translateZ(0);
        }

        to {
          transform: translateX(-15%) translateZ(0);
        }
      }

      @keyframes fadefloat {
        0%,
        100% {
          opacity: 0;
        }

        5%,
        90% {
          opacity: 1;
        }
      }

      [data-clouds] {
        animation: fadeIn 3s ease-out;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        position: absolute;
        user-select: none;
      }

      .cloud {
        animation-duration: 120s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-name: float, fadefloat;
        animation-timing-function: linear;
        block-size: 4.375rem;
        inline-size: 100%;
        position: absolute;
        z-index: 1;
      }

      .cloud svg {
        block-size: 100%;
        inline-size: auto;
      }

      .cloud.foreground {
        --cloud-fill: var(--cloud-fill-foreground-light);

        block-size: 10%;
        min-block-size: 1.25rem;
        z-index: 2;
      }

      .cloud.background {
        --cloud-fill: var(--cloud-fill-background-light);

        animation-duration: 210s;
        block-size: 9.09090909%;
        min-block-size: 0.5rem;
      }
    }

    @media (prefers-color-scheme: dark) {
      .hillside path {
        fill: var(--hillside-fill-dark);
      }

      .cloud.foreground {
        --cloud-fill: var(--cloud-fill-foreground-dark);
      }

      .cloud.background {
        --cloud-fill: var(--cloud-fill-background-dark);
      }
    }
  `;

  /**
   * Create a dynamic set of CSS for the cloud coverage.
   * @param {Number} duration Length of the animations.
   * @param {Number} count Total number of clouds.
   */
  cloudLoop(duration, count) {
    let delay = (duration / 6.5) * -1;
    let height = 0.1;
    let i = count;
    let cssSet = [];

    while (i > 0) {
      let ruleSet = `
      .cloud:nth-child(${i}) {
        animation-delay: ${Math.floor(delay * i)}s;
        inset-block-start: ${i * 6}%;
      }

      .cloud.foreground:nth-child(${i}) {
        animation-duration: ${Math.floor(duration - i * 4)}s;
        block-size: ${Math.abs(Math.floor(height + i * 2.5))}%;
      }

      .cloud.background:nth-child(${i}) {
        animation-duration: ${Math.floor(duration * 1.25 - i * 4)}s;
        block-size: ${Math.abs(Math.floor(height / 1.1 - i * 1.25))}%;
      }
    `;

      cssSet.push(ruleSet);

      i -= 1;
    }

    return cssSet.join("\n");
  }

  get buttonPixels() {
    return `${this.buttonSize}px`;
  }

  #setClouds() {
    this._active = !this._active;
  }

  connectedCallback() {
    super.connectedCallback();

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
    let i = this.cloudCount;
    let clouds = [];

    while (i > 0) {
      let flip = Math.random();
      let choice = "";

      if (flip < 0.5) {
        choice = "foreground";
      } else {
        choice = "background";
      }
      clouds.push(choice);
      i -= 1;
    }

    return map(clouds, (type) => html`<div class="cloud ${type}">${this.renderCloud()}</div>`);
  }

  renderCloud() {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="var(--cloud-fill)"
        stroke="var(--cloud-fill)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
      </svg>
    `;
  }

  renderSun(size) {
    return html`<svg
      part="sundial"
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
      part="sundial"
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
    return html`
      <style>
        @media (prefers-reduced-motion: no-preference) {
          ${this.cloudLoop(120, this.cloudCount)}
        }
      </style>

      <div class="wrapper shell" part="shell">
        <div part="clouds" data-clouds class="${!this._active ? "sunset" : nothing}">
          ${this.renderCloudCoverage()}
        </div>
        <button
          part="sundial-button"
          title="Turn the clouds on or off."
          type="button"
          name="sundial"
          class="sundial sun"
          @click="${this.#setClouds}">
          ${this._active ? this.renderSun(this.buttonPixels) : this.renderMoon(this.buttonPixels)}
        </button>
        <div class="wrapper slotArea" part="wrapper">
          <slot></slot>
        </div>
        ${this.hillside ? this.renderHillside() : nothing}
      </div>
    `;
  }
}

customElements.define("cloudy-sky", CloudySky);
