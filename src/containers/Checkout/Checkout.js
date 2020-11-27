import React, { Component } from 'react';
import CheckoutSummary from '../../components/CheckoutSummary/CheckoutSummary';
import {Route} from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';

class Checkout extends Component {
    // state = {
    //     ingredients: null,
    //     price: 0
    // }
    // componentWillMount (){
    //     const query = new URLSearchParams(this.props.location.search);
    //     const ingredients = {}
    //     let price = 0;
    //     // loop through different query params
    //     for (let param of query.entries()){
    //         //['salad', '1']
    //         if (param[0] === 'price'){
    //             price = param[1];
    //         }else{
    //             ingredients[param[0]] = +param[1]

    //         }
    //         //adding the sign by +param[1] will turn the value into a number
    //     }
    //     this.setState({
    //         ingredients: ingredients,
    //         totalPrice: price
    //     });
    // }
    checkoutCancelled = () => {
        this.props.history.goBack();
    }

    checkoutContinued= () => {
        this.props.history.replace('/checkout/contact-data');
    }
    render(){
        return(
            <div>
                <CheckoutSummary 
                ingredients={this.props.ings}
                checkoutCancelled={this.checkoutCancelled}
                checkoutContinued={this.checkoutContinued}/>
                <Route path={this.props.match.path + '/contact-data'} 
                // render={(props) => (<ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props}/>)}/>
                component={ContactData} />
            </div>
        )
    }

}
const mapStateToProps = state => {
    return {
        ings: state.ingredients
        // price: state.totalPrice
    }
}

export default connect(mapStateToProps)(Checkout);