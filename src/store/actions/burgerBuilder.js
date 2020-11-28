//synchonous actions only in this file
import * as actionTypes from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = (name) => {
    return {
        type: actionTypes.ADD_INGREDIENT,
        ingredientName: name
    }
}

export const removeIngredient = (name) => {
    return {
        type: actionTypes.REMOVE_INGREDIENT,
        ingredientName: name
    }
}
//to use internally on next func
export const setIngredients = (ingredients) => {
    return {
        type: actionTypes.SET_INGREDIENTS,
        //ingredients is the payload
        ingredients: ingredients
    }
}
export const fetchIngredientsFailed = () => {
    return {
        type: actionTypes.FETCH_INGREDIENTS_FAILED
    }
};

//syntax avail due to thunk
export const initIngredients = () => {
    return dispatch => {
        axios.get('https://react-my-burger-b48a2.firebaseio.com/ingredients.json')
        .then(response => {
            //response.data is javas object as response
            dispatch(setIngredients(response.data));
        })
        .catch(error =>{
            dispatch(fetchIngredientsFailed());
        });
    }
};

