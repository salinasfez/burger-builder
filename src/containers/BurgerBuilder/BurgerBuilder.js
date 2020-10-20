import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}
class BurgerBuilder extends Component {
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false, 
        purchasing: false,
        loading: false,
        error: false
    }
    componentDidMount(){
        axios.get('https://react-my-burger-b48a2.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({
                ingredients: response.data
            });
        })
        .catch(error =>{
            this.setState({error: true})
        });
    }

    updatePurchasedState (ingredients) {
        const sum = Object.keys(ingredients)
        .map(igKey => {
            return ingredients[igKey];
        })
        // el is the value accessed with ingredients[igKey].. which is the number of ingreidents
        .reduce((sum, el) => {
            return sum + el;
        },0);
        this.setState({purchaseable: sum > 0});
    }
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPrice, 
            ingredients: updatedIngredients
        })
        this.updatePurchasedState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceDeduction;
        this.setState({
            totalPrice: newPrice, 
            ingredients: updatedIngredients
        })
        this.updatePurchasedState(updatedIngredients);
    }
    purchaseHandler = () => {
        this.setState({
            purchasing: true
        });
    }
    purchaseCancelHandler = () => {
        this.setState({
            purchasing: false
        })
    }
    purchaseContinueHandler = () => {
        this.setState({
            loading: true
        })
        // alert('You continue!');
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Max Salinas',
                address: 'test street',
                zipCode: '209358',
                country: 'Germany'
            },
            email: 'test@test.com',
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json', order)
        .then(res => {
            this.setState({
                loading: false,
                purchasing: false
            });
        })
        .catch(err => {
            this.setState({
                loading: false,
                purchasing: false
            });
        });
    }
    render(){
        // copied in an immutable way
        const disableInfo = {
            ...this.state.ingredients
        };
        for (let key in disableInfo) {
            disableInfo[key] = disableInfo[key] <= 0
        }
        let orderSummary = null;
        
       
        let burger = this.state.error ? <p>Ingredients cant be loaded!</p> : <Spinner />;

        if(this.state.ingredients){
            burger = (
            <Aux>
            <Burger ingredients={this.state.ingredients}/>
            <BuildControls ingredientAdded={this.addIngredientHandler} 
            ingredientRemoved={this.removeIngredientHandler} 
            disabled={disableInfo}
            price={this.state.totalPrice}
            purchaseable={this.state.purchaseable}
            ordered={this.purchaseHandler}/> 
            </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice}
         />
        }
        if (this.state.loading){
            orderSummary = <Spinner/>;
        }
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        )
    }
}
export default withErrorHandler(BurgerBuilder, axios);