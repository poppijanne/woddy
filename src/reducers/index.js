import workout from './workout'
import user from './user'
import exerciseTypes from './exerciseTypes'
import selectedExercises from './selectedExercises'
import selectedCirquits from './selectedCirquits'
import workouts from './workouts'
import timer from './timer'
import sideBar from './sideBar'
import numberSelect from './numberSelect'
import exerciseTypeSelect from './exerciseTypeSelect'
import cirquitTemplateSelect from './cirquitTemplateSelect'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
    user,
    workouts,
    workout,
    timer,
    exerciseTypes,
    selectedExercises,
    selectedCirquits,
    sideBar,
    numberSelect,
    exerciseTypeSelect,
    cirquitTemplateSelect
})

export default rootReducer