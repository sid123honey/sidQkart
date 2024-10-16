import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Container
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react"; 
import { config } from "../App";
import Footer from "./Footer"; 
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard"; 
import "./Products.css";
import Cart, {generateCartItemsFrom} from "./Cart"; 


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

  const [loading, setLoading] = useState(true); 
  const [products, setProducts] = useState(null); 
  const [debounceTimer, setDebounceTimer] = useState(0); 
  const [searchEvent, setSearchEvent] = useState(null); 
  const [cart, setCart] = useState([]); 

  // toaster initialisation 
  const { enqueueSnackbar } = useSnackbar();

  //getting user details from localstorage is user is already logged in else sending null
  const userDetails = localStorage.length===0? null :  ({
    token: localStorage.getItem("token"),
    username: localStorage.getItem("username"),
    balance: localStorage.getItem("balance")
  })

  //cart endpoint to get user's cart information 
  const cartDetailsURL = config.endpoint + "/cart"; 


  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {

    try{
      const getURL = config.endpoint + "/products";
      const response = await axios.get(getURL);
      return response.data;

    }catch(error){
      enqueueSnackbar(error.message,{variant: 'error'}); 
      return null; 
    }

  };

  useEffect(() => {
  
    const onLoadHandler = async()=>{

     try{
      const productData = await performAPICall();
      setProducts(productData);
      setLoading(false); 

      if(userDetails){
        const cartData = await fetchCart(userDetails.token); 
        const cartDetails = generateCartItemsFrom(cartData, productData); 
        setCart(cartDetails); 
      }

     }catch(error){
        console.error('Error fetching data:', error);
        setLoading(false); 
     }
    }

    onLoadHandler(); 

  }, []);



  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    const searchUrl = config.endpoint+"/products/search?value="+text; 

    try{
      const response = await axios.get(searchUrl); 
      return response.data; 
    }catch(error){
      enqueueSnackbar(error.message,{variant: 'error'}); 
      return null;
    }

  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if(debounceTimeout!==0){
      clearTimeout(debounceTimeout); 
    }

    const newTimer = setTimeout(async ()=>{
      try{
        const searchedProducts = await performSearch(event.target.value); 
        setProducts(searchedProducts); 
      }catch(error){
        enqueueSnackbar(error.message,{variant: 'error'}); 
      }
    }, 500); 

    setDebounceTimer(newTimer); 

  };
 
  useEffect(()=>{
    if(searchEvent!==null)
    debounceSearch(searchEvent, debounceTimer); 
  }, [searchEvent])


  const searchTextHandler = (e)=>{
    setSearchEvent(e); 
  }


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const data = await axios.get(cartDetailsURL, {
        headers:{
          "Authorization": "Bearer "+token,
        }
      })

      if(data.data.length===0) return null; 
      return data.data; 

    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    const searchedItem = items.find(item => item["_id"]===productId); 
    if(searchedItem) return true; 
    return false; 
  };



    /*
    Note: if qty is 0 for the first time and there is no same product already present in DB then it accepts that product. 
    If the same product is already present in the DB, then in the response that product is been deleted. Please keep note of that
    */

    const updateCartOnServer = async (productId, qty, token)=>{

      try {
        const response = await axios.post(cartDetailsURL,
          {
            productId: productId,
            qty: qty,
          },
          {
          headers: {
            "Authorization": "Bearer "+token,
            "Content-Type": "application/json",
          }
          }
        )
        const cartDetails = generateCartItemsFrom(response.data, products); 
        setCart(cartDetails);
      } catch (error) {
        enqueueSnackbar(error.message, {variant: "warning"}); 
      }
    }


  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {

    if(isItemInCart(cart, productId) && options.preventDuplicate){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", {variant: "warning"}); 
      return; 
    }

    if(options.preventDuplicate){
      await updateCartOnServer(productId, 1, token); 
      return; 
    }

    await updateCartOnServer(productId, qty, token); 

  };


  return (
    <div>
      <Header hasHiddenAuthButtons={true} children={true} searchTextHandler={searchTextHandler} userDetails={userDetails}/>

         <TextField
            size="small"
            fullWidth 
            className="search-mobile"
            InputProps={{
              endAdornment: ( 
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            onChange={searchTextHandler}
          />

      
      <Grid container>
        <Grid item md={userDetails && 9}>
          <Grid container spacing={1}>
              <Grid item className="product-grid">
                <Box className="hero">
                  <p className="hero-heading">
                    India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                    to your door step
                  </p>
                </Box>
              </Grid>


              <Grid item className="product-grid" style={{margin: "20px" }}>
                {loading ?
                (<div className="loading"> 
                    <CircularProgress/> <p>Loading Products...</p>
                  </div>)
                : (products ? 
                    (<Grid container spacing={2}>
                      {products.map((product)=>(<Grid key={product._id } item className="product-grid" xs={6} md={3}>
                        <ProductCard product={product} handleAddToCart={addToCart} userDetails={userDetails} items={cart} products={products}/>  
                      </Grid>))}
                    </Grid>)
                    : 
                    (<div className="loading"> 
                    <SentimentDissatisfied/>
                    <p>No products found</p>
                  </div>)  
                  )
                }
              </Grid>
          </Grid>
        </Grid>


        {userDetails && (<Grid item xs={12} md={3} sx={{backgroundColor: "#E9F5E1"}}>
                            <Cart items={cart} products={products} handleQuantity={addToCart} token={userDetails.token} isReadOnly={false}/>
                          </Grid>)}

      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
