import { useState } from "react";
import { ProductData } from "../../context/product.contex.jsx";
import { Loading } from "../../components/Loading.jsx";
import ProductCard from "../../components/ProductCard.jsx";

const Home = () => {
    const { product, loading } = ProductData()

    // if (loading) {
    //     return <Loading />
    // }
    return (
        <>
            {
                console.log("products",product)
            }
        </>
    )
}
export default Home
