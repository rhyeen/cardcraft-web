import { html, LitElement } from '@polymer/lit-element';
import { CcSharedStyles } from '../../global/cc-shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../../store.js';

import { 
  CancelSelectHandCard,
  PlaySelectedHandCard } from '../../../actions/card.js';

import '../card-types/cc-full-card.js';
import '../../global/cc-btn.js';

export class CcHandCardPane extends connect(store)(LitElement) {
  _render({_selectedCard}) {
    return html`
      ${CcSharedStyles}
      <style>
        :host {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .action-selections {
          margin: 20px 0 40px 0;
        }

        .action-selections cc-btn:first-child {
          margin-left: 0;
        }

        .action-selections cc-btn {
          margin-left: 20px;
        }
      </style>
      <cc-full-card card="${_selectedCard}"></cc-full-card>
      <div class="action-selections">
        <cc-btn btntype="cancel" on-click="${() => this._cancel()}"></cc-btn>
        <cc-btn btntype="play" on-click="${() => this._play()}"></cc-btn>
      </div>
    `
  }

  static get properties() { return {
    _selectedCard: Object
  }};

  _cancel() {
    store.dispatch(CancelSelectHandCard())
  }

  _play() {
    store.dispatch(PlaySelectedHandCard())
  }

  _stateChanged(state) {
    let cardid = state.card.selectedHandCard.id
    if (!cardid) {
      this._selectedCard = {}
      return
    }
    this._selectedCard = state.card.cards[cardid]
  }
}

window.customElements.define('cc-hand-card-pane', CcHandCardPane);