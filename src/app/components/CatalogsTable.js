'use client'

import { deleteCatalogs } from "@/app/actions/deleteCatalogs";
import { useTool } from "@/app/contexts/ToolContext";
import { Button, Checkbox, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import Link from 'next/link'
import { useState, useEffect } from "react";
import { BiEdit } from "react-icons/bi";
import { HiPlus, HiTrash } from "react-icons/hi";
import { Toast, ToastToggle } from 'flowbite-react';

export default function CatalogsTable() {
    const { catalogs, updateCatalogs } = useTool();
    const [selectedCatalogs, setSelectedCatalogs] = useState([]);
    const [deletingCatalogs, setDeletingCatalogs] = useState(false);
    const [notification, setNotification] = useState(<></>)
    
    useEffect(() => {
      updateCatalogs();
    }, [])

    const renderCatalogs = () => {
        return catalogs.map((catalog, index) => (
          <TableRow key={index} className="bg-lightcyan text-prussianblue">
            <TableCell>
              <Checkbox
              checked={selectedCatalogs.includes(catalog.id)}
              onChange={() => toggleCatalogSelection(catalog.id)}
              className="text-prussianblue focus:ring-jordyblue cursor-pointer border-prussianblue"/>
            </TableCell>
            <TableCell className="whitespace-nowrap font-bold">
              <Link className="py-4 hover:underline" href={`/dashboard/catalogs/${catalog.id}`}>
                {catalog.name}
              </Link>
            </TableCell>
            <TableCell>
              {catalog.store_name}
            </TableCell>
            <TableCell>
              {catalog.products.length}
            </TableCell>
            <TableCell>
              {new Date(catalog.created_at.seconds * 1000).toLocaleString()}
            </TableCell>
            <TableCell>
              <Link href={`/dashboard/catalogs/${catalog.id}`} className="font-medium text-neonblue hover:underline">
                Editar
              </Link>
            </TableCell>
          </TableRow>
        ))
    }

    const toggleCatalogSelection = (catalogId) => {
      if (selectedCatalogs.includes(catalogId)) {
        setSelectedCatalogs(selectedCatalogs.filter(id => id !== catalogId));
      } else {
        setSelectedCatalogs([...selectedCatalogs, catalogId]);
      }
    };

    return (
        <>
            <div className="max-sm:fixed max-sm:z-10 max-sm:bottom-6 left-0 max-sm:flex max-sm:justify-center max-sm:w-full">
              <div className="flex space-x-2 flex-wrap items-center max-sm:flex-row max-sm:bg-lightcyan max-sm:border-jordyblue max-sm:border-4 max-sm:p-2 max-sm:rounded-xl max-sm:flex max-sm:justify-around">
                {selectedCatalogs.length > 0 && (
                  <Button 
                  disabled={deletingCatalogs}
                  onClick={async() => {
                    setDeletingCatalogs(true);
                    setNotification(<Notification setPattern={setNotification} type="warning" message="Excluíndo catálogos..."/>)
                    await deleteCatalogs(selectedCatalogs);
                    setNotification(<Notification setPattern={setNotification} type="success" message="Catálogos excluídos com sucesso"/>)
                    updateCatalogs();
                  }} 
                  className="bg-red-500 hover:!bg-red-500/80 focus:ring-red-700 max-sm:m-0 m-2 max-sm:px-6">
                    <HiTrash className="w-5 h-5 mr-1 max-sm:m-0"/> <span className="max-sm:hidden">Deletar selecionados</span>
                  </Button>
                )}
                <Link href="/dashboard/catalogs/new-catalog">
                  <Button 
                  className="bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue max-sm:m-0 m-2 max-sm:px-6">
                    <HiPlus className="w-5 h-5 mr-1"/> Criar um catálogo
                  </Button>
                </Link>
                {selectedCatalogs.length === 1 && (
                  <Link href={`/dashboard/catalogs/${selectedCatalogs[0]}`}>
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
                    {catalogs.length > 0 && (
                    <Checkbox
                    checked={selectedCatalogs.length === catalogs.length}
                    onChange={() => {
                      catalogs.forEach(catalog => {
                        toggleCatalogSelection(catalog.id)
                      });
                    }}
                    className="text-prussianblue focus:ring-jordyblue cursor-pointer border-prussianblue"/>
                    )}
                  </Table.HeadCell>
                  <TableHeadCell className="bg-cornflowerblue text-white">Nome</TableHeadCell>
                  <TableHeadCell className="bg-cornflowerblue text-white">Loja</TableHeadCell>
                  <TableHeadCell className="bg-cornflowerblue text-white">Produtos</TableHeadCell>
                  <TableHeadCell className="bg-cornflowerblue text-white">Data de criação</TableHeadCell>
                  <TableHeadCell className="bg-cornflowerblue text-white">
                    <span className="sr-only">Editar</span>
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y !w-full">
                  {catalogs === null ? (
                  <TableRow className="bg-jordyblue text-white">
                    <TableCell colSpan={6}>Você ainda não criou um catálogo.</TableCell>
                  </TableRow>
                  ) : renderCatalogs()}
                </TableBody>
              </Table>
            </div>
            {deletingCatalogs && (
              <Toast>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-400">
                  <HiTrash className="w-5 h-5 mr-1 max-sm:m-0"/>
                </div>
                <div className="ml-3 text-sm font-normal">Deletando catálogos...</div>
                <ToastToggle />
              </Toast>
            )}
            {notification}
        </>   
    );
}