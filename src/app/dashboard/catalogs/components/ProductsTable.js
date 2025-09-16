'use client'

import { useState, useEffect } from "react";
import { useTool } from "@/app/contexts/ToolContext";
import Link from 'next/link';
import { deleteProducts } from "../../../actions/deleteProducts";
import { useNotifications } from "../../../hooks/useNotifications";
import ResponsiveTable from "../../../components/ResponsiveTable";
import ActionButtons from "../../../components/ActionButtons";
import { TableCell } from "flowbite-react";

export default function ProductsTable({ catalogId }) {
    const { catalogs, updateCatalogs } = useTool();
    const { notify } = useNotifications();
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    const [selectedProducts, setSelectedProducts] = useState([]);

    useEffect(() => {
      updateCatalogs();
    }, []);

    const toggleProductSelection = (productId) => {
      if (selectedProducts.includes(productId)) {
        setSelectedProducts(prevState => prevState.filter(id => id !== productId));
      } else {
        setSelectedProducts(prevState => [...prevState, productId]);
      }
    };

    const handleSelectAll = () => {
      if (selectedProducts.length === catalog.products.length) {
        setSelectedProducts([]);
      } else {
        setSelectedProducts(catalog.products.map(product => product.id));
      }
    };

    const handleDeleteProducts = async () => {
      notify.processing("Excluindo produtos...");
      try {
        await deleteProducts(selectedProducts);
        notify.productDeleted();
        setSelectedProducts([]);
        updateCatalogs();
      } catch (error) {
        notify.productDeletionFailed();
      }
    };

    const renderProductRow = (product, index) => (
      <>
        <TableCell className="whitespace-nowrap font-bold">
          <Link className="py-4 hover:underline" href={`/dashboard/catalogs/${catalog.id}/${product.id}`}>
            {product.name}
          </Link>
        </TableCell>
        <TableCell>
          {catalog.name}
        </TableCell>
        <TableCell>
          {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </TableCell>
        <TableCell>
          {new Date(product.created_at.seconds * 1000).toLocaleString()}
        </TableCell>
        <TableCell>
          <Link href={`/dashboard/catalogs/${catalog.id}/${product.id}`} className="font-bold text-neonblue hover:underline">
            Editar
          </Link>
        </TableCell>
      </>
    );

    const renderProductCard = (product, index) => (
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <Link className="text-lg font-bold text-prussianblue hover:underline" href={`/dashboard/catalogs/${catalog.id}/${product.id}`}>
            {product.name}
          </Link>
          <Link href={`/dashboard/catalogs/${catalog.id}/${product.id}`} className="text-sm font-bold text-neonblue hover:underline">
            Editar
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Catálogo:</span>
            <p className="text-gray-800">{catalog.name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Preço:</span>
            <p className="text-gray-800 font-bold text-green-600">
              {product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
        </div>
        
        <div className="text-sm">
          <span className="font-medium text-gray-600">Criado em:</span>
          <p className="text-gray-800">{new Date(product.created_at.seconds * 1000).toLocaleString()}</p>
        </div>
      </div>
    );

    const columns = [
      { label: "Nome" },
      { label: "Catálogo" },
      { label: "Preço" },
      { label: "Data de criação" },
      { label: "Ações" }
    ];

    return (
      <>
        <ActionButtons
          selectedCount={selectedProducts.length}
          onDelete={handleDeleteProducts}
          onCreateHref={`/dashboard/catalogs/${catalogId}/new-product`}
          onEditHref={selectedProducts.length === 1 ? `/dashboard/catalogs/${catalogId}/${selectedProducts[0]}` : "#"}
          createLabel="Criar Produto"
          editLabel="Editar Produto"
          deleteLabel="Deletar Produtos"
        />
        
        <ResponsiveTable
          columns={columns}
          data={catalog.products || []}
          renderRow={renderProductRow}
          renderMobileCard={renderProductCard}
          onSelectAll={handleSelectAll}
          onSelectItem={toggleProductSelection}
          selectedItems={selectedProducts}
          selectable={true}
          emptyMessage="Você ainda não criou um produto."
        />
      </>   
    );
}