'use client'

import { createContext, useContext, useEffect, useState } from "react";

const ToolContext = createContext();

export const ToolProvider = ({children, userID}) => {
    const [catalogs, setCatalogs] = useState(false);
    const [orders, setOrders] = useState(false);

    const updateCatalogs = async () => {
        const response = await fetch(`/api/catalogs/get-catalogs/${userID}`);
        const data = await response.json();
        setCatalogs(data);
    };

    const updateOrders = async () => {
        const response =  await fetch(`/api/orders/get-orders/${userID}`);
        const data = await response.json();
        setOrders(data);
    }

    useEffect(() => {
        updateCatalogs();
        updateOrders();
    }, [userID]);

    const context = {
        catalogs,
        orders,
        updateCatalogs,
        updateOrders
    };

    return <ToolContext.Provider value={context}>{children}</ToolContext.Provider>
};

export const useTool = () => {
  return useContext(ToolContext);
};