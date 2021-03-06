import { html, LitElement } from '@polymer/lit-element';
import { CcSharedStyles } from '../global/cc-shared-styles.js';

import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../store.js';

import '../cards/card-types/cc-pawn-card.js';
import '../cards/card-types/cc-replace-card.js';
import '../cards/card-types/cc-attack-card.js';
import '../cards/card-types/cc-target-card.js';

import {
  PLAYER_OWNER,
  OPPONENT_OWNER } from '../../util/owner.js';

import { 
  PlaceOnPlayArea,
  PlayFromPlayArea,
  SelectOpponentFieldCard,
  SelectPlayerFieldCard,
  AttackCard,
  CastAgainstTarget } from '../../actions/app.js';

import { 
  GetCard,
  GetAbility } from '../../util/card.js';

export class CcPlayField extends connect(store)(LitElement) {
  _render({_leftCard, _middleCard, _rightCard, overlay, _totalCardVersion}) {
    let leftCardHtml = this._getCardHtml(_leftCard, 0)
    let middleCardHtml = this._getCardHtml(_middleCard, 1)
    let rightCardHtml = this._getCardHtml(_rightCard, 2)
    return html`
      ${CcSharedStyles}
      <style>
        :host {
          display: flex;
        }
      </style>
      <div class="field-pane left">
        ${leftCardHtml}
      </div>
      <div class="field-pane-separator" overlay?="${overlay}"></div>
      <div class="field-pane middle">
        ${middleCardHtml}
      </div>
      <div class="field-pane-separator" overlay?="${overlay}"></div>
      <div class="field-pane right">
        ${rightCardHtml}
      </div>
    `
  }

  static get properties() { return {
    owner: String,
    overlay: Boolean,
    _leftCard: Object,
    _rightCard: Object,
    _middleCard: Object,
    _attackingCard: Object,
    _replacingCard: Object,
    _targetingOpponentAbilityCard: Object,
    _targetingOpponentAbility: Object,
    _playingFromPlayAreaIndex: Number,
    _targetingUnitAbilityCard: Object,
    _targetingUnitAbility: Object,
    _totalCardVersion: Number // meant soley to force an update, if need be
  }};

  _stateChanged(state) {
    if (state.card.playFromPlayArea.id) {
      this._playingFromPlayAreaIndex = state.card.playFromPlayArea.playAreaIndex
      this._attackingCard = GetCard(state.card.cards, state.card.playFromPlayArea.id, state.card.playFromPlayArea.instance)
    } else {
      this._playingFromPlayAreaIndex = -1
      this._attackingCard = null
    }
    if (state.card.playFromHand.id) {
      this._replacingCard = GetCard(state.card.cards, state.card.playFromHand.id, state.card.playFromHand.instance)
    } else {
      this._replacingCard = null      
    }
    if (state.card.selectedTargetOpponentAbility.id) {
      this._targetingOpponentAbilityCard = GetCard(state.card.cards, state.card.selectedTargetOpponentAbility.id, state.card.selectedTargetOpponentAbility.instance)
      this._targetingOpponentAbility = GetAbility(this._targetingOpponentAbilityCard, state.card.selectedTargetOpponentAbility.abilityId)
      this._
    } else {
      this._targetingOpponentAbilityCard = null
      this._targetingOpponentAbility = null
    }
    if (state.card.selectedTargetUnitAbility.id) {
      this._targetingUnitAbilityCard = GetCard(state.card.cards, state.card.selectedTargetUnitAbility.id, state.card.selectedTargetUnitAbility.instance)
      this._targetingUnitAbility = GetAbility(this._targetingUnitAbilityCard, state.card.selectedTargetUnitAbility.abilityId)
      this._
    } else {
      this._targetingUnitAbilityCard = null
      this._targetingUnitAbility = null
    }
    switch(this.owner) {
      case PLAYER_OWNER:
        this._leftCard = this._getCard(state, state.card.playerField[0].id, state.card.playerField[0].instance)
        this._middleCard = this._getCard(state, state.card.playerField[1].id, state.card.playerField[1].instance)
        this._rightCard = this._getCard(state, state.card.playerField[2].id, state.card.playerField[2].instance)
        break;
      case OPPONENT_OWNER:
        this._leftCard = this._getOpponentCard(state, state.card.opponentField[0].id, state.card.opponentField[0].instance)
        this._middleCard = this._getOpponentCard(state, state.card.opponentField[1].id, state.card.opponentField[1].instance)
        this._rightCard = this._getOpponentCard(state, state.card.opponentField[2].id, state.card.opponentField[2].instance)
        break;
      default:
        console.error(`Invalid owner: ${this.owner}`)
        this._leftCard = null
        this._rightCard = null
        this._middleCard = null
        break;
    }
    this._setTotalCardVersion()
  }

  _setTotalCardVersion() {
    this._totalCardVersion = 0
    this._totalCardVersion += this._getCardVersion(this._leftCard)
    this._totalCardVersion += this._getCardVersion(this._middleCard)
    this._totalCardVersion += this._getCardVersion(this._rightCard)
  }

  _getCardVersion(card) {
    if (!card) {
      return 0
    }
    return card.version
  }

  _getCard(state, cardId, cardInstance) {
    if (!cardId) {
      return null
    }
    return state.card.cards[cardId].instances[cardInstance]
  }

  _getOpponentCard(state, cardId, cardInstance) {
    if (!cardId) {
      return null
    }
    return state.card.opponentCards[cardId].instances[cardInstance]
  }

  _getCardHtml(card, playAreaIndex) {
    if (this._showAttackCard(card, playAreaIndex)) {
      return this._attackCard(card, playAreaIndex)
    }
    if (this._showReplaceCard(card, playAreaIndex)) {
      return this._replaceCard(card, playAreaIndex)
    }
    if (this._showPlayerPawnCard(card)) {
      return this._playerPawnCard(card, playAreaIndex)
    }
    if (this._showSelectedPawnCard(card, playAreaIndex)) {
      return this._selectedPawnCard(card, playAreaIndex)
    }
    if (this._showOpponentPawnCard(card)) {
      return this._opponentPawnCard(card, playAreaIndex)
    }
    if (this._showTargetOpponentAbilityCard(card)) {
      return this._targetOpponentAbilityCard(card, playAreaIndex)
    }
    if (this._showTargetUnitAbilityCard(card)) {
      return this._targetUnitAbilityCard(card, playAreaIndex)
    }
    return html``
  }

  _showAttackCard(card, playAreaIndex) {
    return (
      this._isOverlay() &&
      this._isOpponent() &&
      this._playingFromPlayArea() &&
      this._isWithinRange(card, playAreaIndex) &&
      !this._isExhausted())
  }

  _showReplaceCard() {
    return (
      this._isOverlay() && 
      this._isPlayer() && 
      !this._playingFromPlayArea() && 
      this._replacingCard)
  }

  _showTargetOpponentAbilityCard(card) {
    return (
      this._hasCardToShow(card) &&
      this._isOverlay() && 
      this._isOpponent() && 
      !this._playingFromPlayArea() && 
      this._targetingOpponentAbilityCard)
  }

  _showTargetUnitAbilityCard(card) {
    return (
      this._hasCardToShow(card) &&
      this._isOverlay() && 
      this._isPlayer() && 
      !this._playingFromPlayArea() && 
      this._targetingUnitAbilityCard)
  }

  _showPlayerPawnCard(card) {
    return this._hasCardToShow(card) && !this._isOverlay() && this._isPlayer()
  }

  _showSelectedPawnCard(card, playAreaIndex) {
    return (
      this._hasCardToShow(card) && 
      this._isOverlay() && 
      this._isPlayer() && 
      this._isCardBeingPlayed(playAreaIndex))
  }

  _showOpponentPawnCard(card) {
    return this._hasCardToShow(card) && !this._isOverlay() && this._isOpponent()
  }

  _playingFromPlayArea() {
    return this._playingFromPlayAreaIndex !== -1
  }

  _isWithinRange(opposingCard, playAreaIndex) {
    if (!this._attackingCard || !opposingCard) {
      return false;
    }
    return this._attackingCard.range >= Math.abs(playAreaIndex - this._playingFromPlayAreaIndex) + 1
  }

  _isExhausted() {
    return this._attackingCard.conditions.exhausted
  }

  _isCardBeingPlayed(playAreaIndex) {
    return this._playingFromPlayAreaIndex === playAreaIndex
  }

  _isOpponent() {
    return this.owner === OPPONENT_OWNER
  }

  _isPlayer() {
    return this.owner === PLAYER_OWNER
  }

  _isOverlay() {
    return !!this.overlay
  }

  _hasCardToShow(card) {
    return !!card
  }

  _attackCard(card, playAreaIndex) {
    return html`
      <cc-attack-card
          attacked="${card}"
          attacking="${this._attackingCard}"
          on-click="${() => store.dispatch(AttackCard(playAreaIndex))}"></cc-attack-card>`
  }

  _replaceCard(card, playAreaIndex) {
    return html`
      <cc-replace-card
          replaced="${card}"
          replacing="${this._replacingCard}"
          on-click="${() => store.dispatch(PlaceOnPlayArea(playAreaIndex))}"></cc-replace-card>`
  }

  _playerPawnCard(card, playAreaIndex) {
    return html`
      <cc-pawn-card
          card="${card}"
          cardversion$="${card.version}"
          on-click="${() => store.dispatch(PlayFromPlayArea(playAreaIndex))}"></cc-pawn-card>`
  }

  _selectedPawnCard(card, playAreaIndex) {
    return html`
      <cc-pawn-card
          card="${card}"
          cardversion$="${card.version}"
          on-click="${() => store.dispatch(SelectPlayerFieldCard(playAreaIndex))}"></cc-pawn-card>`
  }

  _opponentPawnCard(card, playAreaIndex) {
    return html`
      <cc-pawn-card
          card="${card}"
          cardversion$="${card.version}"
          on-click="${() => store.dispatch(SelectOpponentFieldCard(playAreaIndex))}"></cc-pawn-card>`
  }

  _targetOpponentAbilityCard(card, playAreaIndex) {
    return html`
      <cc-target-card
          target="${card}"
          caster="${this._targetingOpponentAbilityCard}"
          ability="${this._targetingOpponentAbility}"
          on-click="${() => store.dispatch(CastAgainstTarget(playAreaIndex))}"></cc-target-card>`
  }

  _targetUnitAbilityCard(card, playAreaIndex) {
    return html`
      <cc-target-card
          target="${card}"
          caster="${this._targetingUnitAbilityCard}"
          ability="${this._targetingUnitAbility}"
          on-click="${() => store.dispatch(CastAgainstTarget(playAreaIndex))}"></cc-target-card>`
  }
}

window.customElements.define('cc-play-field', CcPlayField);
