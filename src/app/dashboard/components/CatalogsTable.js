'use client'
import { useState, useEffect } from "react";
import { deleteCatalogs } from "@/app/actions/deleteCatalogs";
import { useTool } from "@/app/contexts/ToolContext";
import Link from 'next/link';
import { useNotifications } from "../../hooks/useNotifications";
import { useAuth } from "../../contexts/AuthContext";
import ResponsiveTable from "../../components/ResponsiveTable";
import ActionButtons from "../../components/ActionButtons";
import { TableCell } from "flowbite-react";

export default function CatalogsTable() {
    const { user } = useAuth();
    const { catalogs, updateCatalogs } = useTool();
    const [selectedCatalogs, setSelectedCatalogs] = useState([]);
    const { notify } = useNotifications();

    useEffect(() => {
      updateCatalogs();
    }, []);

    const toggleCatalogSelection = (catalogId) => {
      const selectedIndex = selectedCatalogs.findIndex(cat => cat.id === catalogId);
      if (selectedIndex !== -1) {
        const updatedSelectedCatalogs = [...selectedCatalogs];
        updatedSelectedCatalogs.splice(selectedIndex, 1);
        setSelectedCatalogs(updatedSelectedCatalogs);
      } else {
        const catalog = catalogs.find(cat => cat.id === catalogId);
        setSelectedCatalogs(prevState => [...prevState, { id: catalogId, whatsapp_session: catalog.whatsapp_session }]);
      }
    };

    const handleSelectAll = () => {
      if (selectedCatalogs.length === catalogs.length) {
        setSelectedCatalogs([]);
      } else {
        setSelectedCatalogs(catalogs.map(catalog => ({ id: catalog.id, whatsapp_session: catalog.whatsapp_session })));
      }
    };

    const handleDeleteCatalogs = async () => {
      notify.processing("Excluindo catálogos...");
      await deleteCatalogs(selectedCatalogs, user.uid);
      notify.catalogDeleted();
      setSelectedCatalogs([]);
      updateCatalogs();
    };

    const renderCatalogRow = (catalog, index) => (
      <>
        <TableCell className="whitespace-nowrap font-bold">
          <Link className="py-4 hover:underline text-primary-600" href={`/dashboard/catalogs/${catalog.id}`}>
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
          <Link href={`/dashboard/catalogs/${catalog.id}`} className="font-bold text-primary-400 hover:underline">
            Editar
          </Link>
        </TableCell>
      </>
    );

    const renderCatalogCard = (catalog, index) => (
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <Link className="text-lg font-bold text-primary-600 hover:underline" href={`/dashboard/catalogs/${catalog.id}`}>
            {catalog.name}
          </Link>
          <Link href={`/dashboard/catalogs/${catalog.id}`} className="text-sm font-bold text-primary-400 hover:underline">
            Editar
          </Link>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Loja:</span>
            <p className="text-gray-800">{catalog.store_name}</p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Produtos:</span>
            <p className="text-gray-800">{catalog.products.length}</p>
          </div>
        </div>
        
        <div className="text-sm">
          <span className="font-medium text-gray-600">Criado em:</span>
          <p className="text-gray-800">{new Date(catalog.created_at.seconds * 1000).toLocaleString()}</p>
        </div>
      </div>
    );

    const columns = [
      { label: "Nome" },
      { label: "Loja" },
      { label: "Qtd. de Produtos" },
      { label: "Data de criação" },
      { label: "Ações" }
    ];

    return (
      <>
        <ActionButtons
          selectedCount={selectedCatalogs.length}
          onDelete={handleDeleteCatalogs}
          onCreateHref="/dashboard/catalogs/new-catalog"
          onEditHref={selectedCatalogs.length === 1 ? `/dashboard/catalogs/${selectedCatalogs[0].id}` : "#"}
          createLabel="Criar Catálogo"
          editLabel="Editar Catálogo"
          deleteLabel="Deletar Catálogos"
        />
        
        <ResponsiveTable
          columns={columns}
          data={catalogs || []}
          renderRow={renderCatalogRow}
          renderMobileCard={renderCatalogCard}
          onSelectAll={handleSelectAll}
          onSelectItem={toggleCatalogSelection}
          selectedItems={selectedCatalogs.map(cat => cat.id)}
          selectable={true}
          emptyMessage="Você ainda não criou um catálogo."
        />
      </>   
    );
}

