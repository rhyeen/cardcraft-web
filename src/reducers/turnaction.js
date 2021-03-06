import { 
  RECORD_ATTACK_CARD,
  RECORD_PLACE_ON_PLAY_AREA,
  END_TURN,
  APPEND_PLAYER_HISTORY,
  APPEND_OPPONENT_HISTORY,
  BEGIN_TURN,
  RECORD_CAST_FROM_HAND,
  RECORD_CAST_FROM_PLAY_AREA,
  RECORD_CAST_NO_TARGET_ABILITY,
  RECORD_CAST_OPPONENT_TARGET_ABILITY,
  RECORD_CAST_UNIT_TARGET_ABILITY,
  BEGIN_OPPONENT_TURN } from '../actions/domains/turnaction.js';

import {
  ATTACK_CARD,
  PLACE_ON_PLAY_AREA,
  CAST_CARD_FROM_HAND,
  CAST_CARD_FROM_PLAY_AREA } from '../actions/domains/card.js';


export const FIRST_TURN_PLAYER = 'player';
export const FIRST_TURN_OPPONENT = 'opponent';

const defaultState = {
  pendingTurn: [],
  lastCastedCard: {},
  firstTurn: FIRST_TURN_PLAYER,
  playersTurn: false,
  playerHistory: [],
  opponentHistory: []
}

defaultState.playersTurn = defaultState.firstTurn === FIRST_TURN_PLAYER

const app = (state = defaultState, action) => {
  switch (action.type) {
    case RECORD_ATTACK_CARD:
      state.pendingTurn.push({
        type: ATTACK_CARD,
        playerFieldCardIndex: action.playerFieldCardIndex,
        opponentFieldCardIndex: action.opponentFieldCardIndex
      })
      return state
    case RECORD_PLACE_ON_PLAY_AREA:
      state.pendingTurn.push({
        type: PLACE_ON_PLAY_AREA,
        playerFieldCardIndex: action.playerFieldCardIndex,
        handCardIndex: action.handCardIndex
      })
      return state
    case END_TURN:
      return {
        ...state,
        lastCastedCard: {}
      }
    case BEGIN_OPPONENT_TURN:
      return {
        ...state,
        playersTurn: false
      }
    case BEGIN_TURN:
      return {
        ...state,
        pendingTurn: [],
        playersTurn: true
      }
    case APPEND_PLAYER_HISTORY:
      state.playerHistory.push(action.turn)
      return state
    case APPEND_OPPONENT_HISTORY:
      state.opponentHistory.push(action.turn)
      return state
    case RECORD_CAST_FROM_HAND:
      if (state.lastCastedCard.id === action.cardId && state.lastCastedCard.instance === action.cardInstance) {
        return state
      }
      state.lastCastedCard = {
        id: action.cardId,
        instance: action.cardInstance
      }
      state.pendingTurn.push({
        type: CAST_CARD_FROM_HAND,
        handCardIndex: action.handCardIndex,
        abilities: []
      })
      return state
    case RECORD_CAST_FROM_PLAY_AREA:
      if (state.lastCastedCard.id === action.cardId && state.lastCastedCard.cardInstance === action.cardInstance) {
        return state
      }
      state.lastCastedCard = {
        id: action.cardId,
        instance: action.cardInstance
      }
      state.pendingTurn.push({
        type: CAST_CARD_FROM_PLAY_AREA,
        handCardIndex: action.playerFieldCardIndex,
        abilities: []
      })
      return state
    case RECORD_CAST_NO_TARGET_ABILITY:
      _getPendingAction(state).abilities.push({
        id: action.abilityId
      })
      return state
    case RECORD_CAST_OPPONENT_TARGET_ABILITY:
      _getPendingAction(state).abilities.push({
        id: action.abilityId,
        opponentFieldCardIndex: action.opponentFieldCardIndex
      })
      return state
    case RECORD_CAST_UNIT_TARGET_ABILITY:
      _getPendingAction(state).abilities.push({
        id: action.abilityId,
        playerFieldCardIndex: action.playerFieldCardIndex
      })
      return state
    default:
      return state;
  }
}

function _getPendingAction(state) {
  const pendingAction = state.pendingTurn[state.pendingTurn.length - 1]
  if (pendingAction.type !== CAST_CARD_FROM_HAND && pendingAction.type !== CAST_CARD_FROM_PLAY_AREA) {
    console.error(`Unexpected turn state: ${pendingAction.type}`)
    return { abilities: [] }
  }
  return pendingAction
}

export default app;
