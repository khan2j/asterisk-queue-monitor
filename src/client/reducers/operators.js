import {ADD_OPERATOR, UPDATE_OPERATORS} from '../actions/operatorActions'
import * as _ from 'lodash'

const initialState = {
  operators: []
}

const compactOperators = (array) => {
  const result = []

  const convertedOperators = array.map(el => {
    el.queue = _.castArray({
      queue: el.queue,
      active: !!(+el.inCall)
    })
    el.lastCall = !!(+el.lastCall) && new Date(el.lastCall * 1000).toLocaleTimeString()
    el.status = +el.paused ? `paused`
      : +el.status === 2 ? `busy`
      : `free`
    return el
  })
  _.forEach(convertedOperators, operatorItem => {
    let index = _.findIndex(result, el => el.name === operatorItem.name)
    if (index === -1) {
      result.push(operatorItem)
    } else {
      result[index].queue = [...result[index].queue, operatorItem.queue[0]]
    }
  })
  return result
}

export const operatorsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_OPERATOR:
      return {...state, operators: action.payload}
    case UPDATE_OPERATORS:
      return {...state, operators: compactOperators(action.payload)}
    default:
      return state
  }
}