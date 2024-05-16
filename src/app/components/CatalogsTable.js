'use client'
import { useState, useEffect } from "react";
import { deleteCatalogs } from "@/app/actions/deleteCatalogs";
import { useTool } from "@/app/contexts/ToolContext";
import { Button, Checkbox, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Toast } from 'flowbite-react';
import Link from 'next/link';
import { BiEdit } from "react-icons/bi";
import { HiPlus, HiTrash } from "react-icons/hi";
import Notification from "./Notification";
import { useAuth } from "../contexts/AuthContext";

export default function CatalogsTable() {
    const { user } = useAuth();
    const { catalogs, updateCatalogs } = useTool();
    const [selectedCatalogs, setSelectedCatalogs] = useState([]);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
      updateCatalogs();
    }, []);

    const toggleCatalogSelection = (catalogId, whatsappSession) => {
      console.log(selectedCatalogs)
      const selectedIndex = selectedCatalogs.findIndex(cat => cat.id === catalogId && cat.whatsapp_session === whatsappSession);
      if (selectedIndex !== -1) {
        const updatedSelectedCatalogs = [...selectedCatalogs];
        updatedSelectedCatalogs.splice(selectedIndex, 1);
        setSelectedCatalogs(updatedSelectedCatalogs);
      } else {
        setSelectedCatalogs(prevState => [...prevState, { id: catalogId, whatsapp_session: whatsappSession }]);
      }
    };

    const handleDeleteCatalogs = async () => {
      setNotification(<Notification setPattern={setNotification} type="warning" message="Excluíndo catálogos..."/>);
      await deleteCatalogs(selectedCatalogs, user.uid);
      setNotification(<Notification setPattern={setNotification} type="success" message="Catálogos excluídos com sucesso"/>);
      setSelectedCatalogs([]);
      updateCatalogs();
    };

    const renderCatalogs = () => {
      return catalogs.map((catalog, index) => (
        <TableRow key={index} className="bg-lightcyan text-prussianblue">
          <TableCell>
            <Checkbox
              checked={selectedCatalogs.some(cat => cat.id === catalog.id && cat.whatsapp_session === catalog.whatsapp_session)}
              onChange={() => toggleCatalogSelection(catalog.id, catalog.whatsapp_session)}
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
            <Link href={`/dashboard/catalogs/${catalog.id}`} className="font-bold text-neonblue hover:underline">
              Editar
            </Link>
          </TableCell>
        </TableRow>
      ));
    };

    return (
      <>
        <div className="max-sm:fixed max-sm:z-10 max-sm:bottom-6 left-0 max-sm:flex max-sm:justify-center max-sm:w-full">
          <div className="flex flex-wrap items-center max-sm:flex-row max-sm:bg-lightcyan max-sm:border-jordyblue max-sm:border-4 max-sm:rounded-xl max-sm:flex max-sm:justify-around">
            {selectedCatalogs.length > 0 && (
              <Button 
                disabled={notification !== null}
                onClick={handleDeleteCatalogs}
                className="duration-200 bg-red-500 hover:!bg-red-500/80 focus:ring-red-700 m-2 max-[344px]:px-6">
                <HiTrash className="w-5 h-5 mr-1 max-sm:m-0"/> Deletar
              </Button>
            )}
            <Link href="/dashboard/catalogs/new-catalog">
              <Button 
                className="duration-200 bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue m-2 max-[344px]:px-6">
                <HiPlus className="w-5 h-5 mr-1"/> Criar
              </Button>
            </Link>
            {selectedCatalogs.length === 1 && (
              <Link href={`/dashboard/catalogs/${selectedCatalogs[0].id}`}>
                <Button className="duration-200 bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue m-2 max-[344px]:px-6">
                  <BiEdit className="w-5 h-5 mr-1 max-sm:m-0"/> Editar
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <Table>
            <TableHead>
              <TableHeadCell className="p-4 bg-cornflowerblue">
                {catalogs !== null && (
                  <Checkbox
                    checked={selectedCatalogs.length === catalogs.length}
                    onChange={() => {
                      if (selectedCatalogs.length === catalogs.length) {
                        setSelectedCatalogs([]);
                      } else {
                        setSelectedCatalogs(catalogs.map(catalog => ({ id: catalog.id, whatsapp_session: catalog.whatsapp_session })));
                      }
                    }}
                    className="text-prussianblue focus:ring-jordyblue cursor-pointer border-prussianblue"/>
                )}
              </TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Nome</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Loja</TableHeadCell>
              <TableHeadCell className="bg-cornflowerblue text-white">Qtd. de Produtos</TableHeadCell>
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
        {notification}
      </>   
    );
}

