import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  let cartItems = []; 

  //could have used map and find method to impelement this. map() on cartData and find() on productsData pwq
  cartData.forEach((cartEle)=>{
    productsData.forEach((productEle)=>{
      if(cartEle.productId === productEle["_id"]){ 
        cartItems.push({
          ...productEle, 
          qty: cartEle.qty
        })
      }
    })
  })
  return cartItems; 

};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items) => {

  return items.reduce((acc, item)=>{
    return acc + (item.qty*item.cost); 
  }, 0); 

};


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  productId, 
  isReadOnly
}) => {
  
  return (
    <Stack direction="row" alignItems="center">
      {
        !isReadOnly && (<IconButton size="small" color="primary" onClick={()=>handleDelete(value-1, productId)}>
        <RemoveOutlined />
      </IconButton>)
      }
      <Box padding="0.5rem" data-testid="item-qty">
        {isReadOnly && "Qty: "}{value}
      </Box>
      {
        !isReadOnly && (<IconButton size="small" color="primary" onClick={()=>handleAdd(value+1, productId)}>
        <AddOutlined />
      </IconButton>)
      }
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items,
  handleQuantity,
  token, 
  isReadOnly
}) => {

  const history = useHistory(); 

  if (!items.length) {
    return ( 
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }


  const handleAdd = async (qty, productId)=>{
    await handleQuantity(token, items, products, productId, qty); 
  }

  const handleDelete = async (qty, productId)=>{
    await handleQuantity(token, items, products, productId, qty); 
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}

        {items.map(cartItem => (cartItem.qty && <Box key={cartItem["_id"]} display="flex" alignItems="flex-start" padding="1rem">
            <Box className="image-container">
                <img
                    // Add product image
                    src={cartItem.image}
                    // Add product name as alt eext
                    alt={cartItem.name}
                    width="100%"
                    height="100%"
                />
              </Box>
              <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="6rem"
                  paddingX="1rem"
                >
                  <div>{cartItem.name}</div>
                  <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                  >
                    <ItemQuantity
                    // Add required props by checking implementation
                    value={cartItem.qty}
                    productId={cartItem["_id"]}
                    handleAdd={handleAdd}
                    handleDelete={handleDelete}
                    isReadOnly={isReadOnly}
                    />
                    <Box padding="0.5rem" fontWeight="700">
                    ${cartItem.cost}
                    </Box>
                  </Box>
              </Box>
        </Box>))}



        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

       {
        !isReadOnly && (<Box display="flex" justifyContent="flex-end" className="cart-footer">
        <Button
          color="primary"
          variant="contained"
          startIcon={<ShoppingCart />}
          className="checkout-btn"
          onClick={()=> history.push("/checkout")}
        >
          Checkout
        </Button>
      </Box>)
       }
      </Box>
    </>
  );
};

export default Cart;
