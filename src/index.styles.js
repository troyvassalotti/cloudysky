import { css, unsafeCSS } from "lit";

function cloudLoop(duration, count) {
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
        block-size: ${Math.floor(height + i * 2.5)}%;
      }

      .cloud.background:nth-child(${i}) {
        animation-duration: ${Math.floor(duration * 1.25 - i * 4)}s;
        block-size: ${Math.floor(height / 1.1 - i * 1.25)}%;
      }
    `;

    cssSet.push(ruleSet);

    i -= 1;
  }

  return cssSet.join("\n");
}

export default css`
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
      block-size: min(33vh, 60%);
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

    ${unsafeCSS(cloudLoop(120, 10))}
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
