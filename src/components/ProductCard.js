import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card, 
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";
import { useSnackbar } from "notistack";



const ProductCard = ({ product, handleAddToCart, userDetails, items, products}) => {

  const { enqueueSnackbar } = useSnackbar();


  return (
    <Card className="card" variant="outlined" sx={{ maxWidth: 345 }}> 

      <CardMedia
        component="img"
        height="250"
        image={product.image}
        alt="Paella dish"
      />

      <CardContent sx={{"& > *" : {marginBottom:"10px"}}}>

          <Typography variant="subtitle1" component="div" sx={{marginBottom:"5px"}}>
            {product.name}
          </Typography>

          <Typography variant="subtitle" component="div" sx={{fontWeight:"bold", marginBottom:"10px"}}>
            ${product.cost}
          </Typography>

          <div>
          <Rating name="read-only" value={product.rating} readOnly />
          </div>

          <Button className="button" variant="contained" sx={{width: "100%"}} onClick={()=>{
            if(!userDetails){
              enqueueSnackbar("Login to add an item to the Cart",{variant: 'warning'});
              return; 
            }
            handleAddToCart(userDetails.token, items, products, product["_id"], 1, {preventDuplicate:true}); 
          }}>
            <AddShoppingCartOutlined/>
            ADD TO CART 
          </Button>

      </CardContent>
    
    </Card>
  );
};

export default ProductCard;
