import { html, LitElement } from '@polymer/lit-element';
import { CcSharedStyles } from '../global/cc-shared-styles.js';

import { ForgeIcon } from '../global/cc-icons.js';

export class CcCraftingForge extends LitElement {
  _render() {
    return html`
      ${CcSharedStyles}
      <style>
        :host {
          display: flex;
          width: 100%;
          flex: 0 0 200px;
          align-items: center;
          justify-content: space-between;
        }

        [forge-cast] {
          width: 100%;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        [forge-mold] {
          display: flex;
          align-items: center;
          justify-content: center;
          width: calc(var(--pawn-card-width));
          height: calc(var(--pawn-card-height));
          box-shadow: var(--cc-elevation-n1);
          border-radius: 8px;
          background-color: #ECEFF1;
        }

        .forge-mold-icon {
          width: 32px;
          height: 32px;
          fill: #CFD8DC;
          margin-left: -4px; /* the anvil icon just appears a bit off-center */
        }
      </style>

      <div forge-cast>
        <div forge-mold>${ForgeIcon('forge-mold-icon')}</div>
      </div>
      <div forge-cast>
        <div forge-mold>${ForgeIcon('forge-mold-icon')}</div>
      </div>
    `
  }
}

window.customElements.define('cc-crafting-forge', CcCraftingForge);
