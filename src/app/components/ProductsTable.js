'use client'
import { useTool } from "@/app/contexts/ToolContext"
import { Button, Checkbox, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import Link from 'next/link'
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { HiPlus, HiTrash } from "react-icons/hi";
import { deleteProducts } from "../actions";

export default function ProductsTable({catalogId}) {
    const { catalogs, updateCatalogs } = useTool();
    const [deletingProducts, setDeletingProducts] = useState(false);
    const catalog = catalogs.find(catalog => catalog.id === catalogId);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [notification, setNotification] = useState(<></>)

    useEffect(() => {
      return () => updateCatalogs();
    }, [])

    const renderProducts = () => {
      return catalog.products.map((product, index) => (
        <TableRow key={index} className="bg-lightcyan text-prussianblue">
          <TableCell>
            <Checkbox
            checked={selectedProducts.includes(product.id)}
            onChange={() => toggleProductSelection(product.id)}
            className="text-prussianblue focus:ring-jordyblue cursor-pointer border-prussianblue"/>
          </TableCell>
          <TableCell className="whitespace-nowrap font-bold">
            <Link className="py-6 hover:underline" href={`/dashboard/catalogs/${catalog.id}/${product.id}`}>
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
            <Link href={`/dashboard/catalogs/${catalog.id}/${product.id}`} className="font-medium text-neonblue hover:underline">
              Editar
            </Link>
          </TableCell>
        </TableRow>
      ))
    }

    const toggleProductSelection = (productId) => {
      if (selectedProducts.includes(productId)) {
          setSelectedProducts(selectedProducts.filter(id => id !== productId));
      } else {
          setSelectedProducts([...selectedProducts, productId]);
      }
  };

  return(
      <>
        <div className="max-sm:fixed max-sm:z-10 max-sm:bottom-6 left-0 max-sm:flex max-sm:justify-center max-sm:w-full">
          <div className="flex flex-wrap items-center max-sm:flex-row max-sm:bg-lightcyan max-sm:border-jordyblue max-sm:border-4 max-sm:p-2 max-sm:rounded-xl max-sm:flex max-sm:justify-around">
            {selectedProducts.length > 0 && (
              <Button 
              disabled={deletingProducts}
              onClick={async() => {
                setDeletingProducts(true);
                setNotification(<Notification setPattern={setNotification} type="warning" message="Excluíndo produtos..."/>)
                await deleteProducts(selectedProducts);
                setNotification(<Notification setPattern={setNotification} type="success" message="Produtos excluídos com sucesso"/>)
                updateCatalogs();
              }} 
              className="bg-red-500 hover:!bg-red-500/80 focus:ring-red-700 max-sm:m-0 m-2 max-sm:px-6">
                <HiTrash className="w-5 h-5 mr-1 max-sm:m-0"/> <span className="max-sm:hidden">Deletar selecionados</span>
              </Button>
            )}
            <Link href={`/dashboard/catalogs/${catalogId}/new-product`}>
              <Button 
              className="bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue max-sm:m-0 m-2 max-sm:px-6">
                <HiPlus className="w-5 h-5 mr-1 "/> Criar um produto
              </Button>
            </Link>
            {selectedProducts.length === 1 && (
              <Link href={`/dashboard/catalogs/${catalogId}/${selectedProducts[0]}`}>
                <Button className="bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue max-sm:m-0 m-2 max-sm:px-6">
                  <BiEdit className="w-5 h-5 mr-1 max-sm:m-0"/> <span className="max-sm:hidden">Editar selecionado</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHead>
              <Table.HeadCell className="p-4 bg-cornflowerblue">
                {catalog.products.length > 0 && (
                <Checkbox
                checked={selectedProducts.length === catalog.products.length}
                onChange={() => {
                  if (selectedProducts.length === catalog.products.length) {
                    setSelectedProducts([]);
                  } else {
                      const allProductIds = catalog.products.map(product => product.id);
                      setSelectedProducts(allProductIds);
                  }
                }}
                className="text-prussianblue focus:ring-jordyblue cursor-pointer border-prussianblue"/>
                )}
              </Table.HeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Nome</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Catálogo</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Preço</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Data de criação</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">
                <span className="sr-only">Editar</span>
              </TableHeadCell>
            </TableHead>
            <TableBody className="divide-y !w-full">
              {catalog.products.length < 1 ? (
                <TableRow className="bg-jordyblue text-white">
                  <TableCell colSpan={7}>Você ainda não criou um produto.</TableCell>
                </TableRow>
              ) : renderProducts()}
            </TableBody>
          </Table>
        </div>
        {notification}
      </>
    )
}