import { LitElement, html } from '@polymer/lit-element';
import {
  CcSharedStyles,
  CardRarityColor } from '../../global/cc-shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../store.js';

import { PLAYER_OWNER } from '../../../data/owner';

class CcReplaceCard extends connect(store)(LitElement) {
  _render({_showCard}) {
    return html`
      ${CcSharedStyles}

      <style>
        :host {
          --card-padding: 8px;
          --card-border-width: 2px;
          display: ${_showCard ? 'block' : 'none'};
          width: calc(var(--pawn-card-width) - 2*var(--card-padding) - 2*var(--card-border-width));
          height: calc(var(--pawn-card-height) - 2*var(--card-padding) - 2*var(--card-border-width));
          border: var(--card-border-width) dashed #8D6E63;
          border-radius: 8px;
          padding: var(--card-padding);
        }
      </style>

    `;
  };
  
  static get properties() { return {
    card: Object,
    _showCard: Boolean
  }};

  _stateChanged(state) {
    this._showCard = state.card.playFromHand.id
  }
}
window.customElements.define('cc-replace-card', CcReplaceCard);