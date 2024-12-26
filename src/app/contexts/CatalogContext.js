import { createContext, useContext, useEffect, useState } from "react";

const CatalogContext = createContext();

export const CatalogProvider = ({children}) => {
    const [cart, setCart] = useState([]);
    const [viewingCart, setViewingCart] = useState(false)

    const updateCart = () => {
        const storagedCart = localStorage.getItem('cart');
        const cartArray = JSON.parse(storagedCart);
        setCart(cartArray || []);
    }

    useEffect(() => {
        updateCart();
    }, [])

    const addProductToCatalog = (product, variations) => {
        const storagedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = storagedCart.findIndex(item => item.id === product.id && item.variations.toString() === variations.toString());
    
        if (existingProductIndex !== -1) {
            storagedCart[existingProductIndex].quantity += 1;
        } else {
            storagedCart.push({ ...product, variations, quantity: 1 });
        }
    
        localStorage.setItem('cart', JSON.stringify(storagedCart));
        setCart(storagedCart);
    };
    
    const removeProductFromCatalog = (productId, variations) => {
        let storagedCart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = storagedCart.findIndex(item => item.id === productId && item.variations.toString() === variations.toString());
    
        if (existingProductIndex !== -1) {
            if (storagedCart[existingProductIndex].quantity > 1) {
                storagedCart[existingProductIndex].quantity -= 1;
            } else {
                storagedCart = storagedCart.filter(item => !(item.id === productId && item.variations.toString() === variations.toString()));
            }
        }
    
        localStorage.setItem('cart', JSON.stringify(storagedCart));
        setCart(storagedCart);
    };

    

    const context = {
        cart,
        setCart,
        viewingCart,
        setViewingCart,
        addProductToCatalog,
        removeProductFromCatalog
    };

    return <CatalogContext.Provider value={context}>{children}</CatalogContext.Provider>
};

export const useCatalog = () => {
  return useContext(CatalogContext);
};