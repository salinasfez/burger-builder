import React from 'react';
import classes from './Burger.module.css';
import BurgerIngredient from './BurgerIngredients/BurgerIngredient';
import { withRouter } from 'react-router-dom';


const burger = (props) => {
    console.log(props)
    // will grab keys from object and turn them into an array
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igKey => {
            // constructing an array..(3) will give you three elements for ex.
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                 return <BurgerIngredient key={igKey + i} type={igKey} />
            })
        })
        .reduce((arr, el) => {
            return arr.concat(el)
        }, []);
    if (transformedIngredients.length === 0){
        transformedIngredients = <p>Please start adding ingredients!</p>
    }

    return(
        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top'/>
            {transformedIngredients}
            <BurgerIngredient type='bread-bottom'/>
        </div>
    );

};

export default withRouter(burger);