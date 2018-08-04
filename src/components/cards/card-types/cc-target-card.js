import { LitElement, html } from '@polymer/lit-element';
import {
  CcSharedStyles } from '../../global/cc-shared-styles.js';

import {
  GetCastOnTargetedCardResults } from '../../../util/card.js';

import {
  DeadIcon,
  HealthIcon } from '../../global/cc-icons.js';

import {
  GetAbilityIcon } from '../../../util/card-constants.js';

class CcTargetCard extends LitElement {
  _render({caster, ability, target}) {
    const targetResultHtml = this._getTargetedResultHtml(caster, ability, target)
    const casterResultHtml = this._getCasterResultHtml(ability)

    return html`
      ${CcSharedStyles}

      <style>
        :host {
          --card-padding: 8px;
          --card-border-width: 2px;
          width: calc(var(--pawn-card-width) - 2*var(--card-padding) - 2*var(--card-border-width));
          height: calc(var(--pawn-card-height) - 2*var(--card-padding) - 2*var(--card-border-width));
          border: var(--card-border-width) dashed #e53935;
          border-radius: 8px;
          padding: var(--card-padding);
          background-color: var(--overlay-card-white);
          display: flex;
          flex-direction: column;
        }
      </style>

      <div class="overlay-card-top">
        ${targetResultHtml}
      </div>
      <div class="overlay-card-separator"></div>
      <div class="overlay-card-bottom">
        ${casterResultHtml}
      </div>
    `;
  };
  
  static get properties() { return {
    caster: Object,
    target: Object,
    ability: String
  }};
  
  _getCasterResultHtml(ability) {
    return GetAbilityIcon(ability)
  }

  _getTargetedResultHtml(caster, ability, target) {
    const _target = GetCastOnTargetedCardResults(caster, ability, target)
    return  this._getHealthResultHtml(_target.health - target.health, _target.health)
  }

  _getHealthResultHtml(lostHealth, remainingHealth) {
    if (remainingHealth <= 0) {
      return html`${DeadIcon()}`
    }
    return html`${lostHealth} ${HealthIcon()}`
  }
}
window.customElements.define('cc-target-card', CcTargetCard);