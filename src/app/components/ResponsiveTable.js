'use client'
import { useState } from 'react';
import { Checkbox, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';

export default function ResponsiveTable({ 
  columns, 
  data, 
  renderRow, 
  renderMobileCard,
  onSelectAll,
  onSelectItem,
  selectedItems = [],
  selectable = true,
  emptyMessage = "Nenhum item encontrado",
  className = ""
}) {
  const [isMobile, setIsMobile] = useState(false);

  // Detecta se é mobile
  useState(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const allSelected = selectedItems.length === data.length && data.length > 0;
  const someSelected = selectedItems.length > 0 && selectedItems.length < data.length;

  if (isMobile) {
    return (
      <div className={`space-y-4 ${className}`}>
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            {emptyMessage}
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
              {selectable && (
                <div className="flex items-center mb-3">
                  <Checkbox
                    checked={selectedItems.includes(item.id || index)}
                    onChange={() => onSelectItem(item.id || index)}
                    className="text-primary-800 focus:ring-primary-200 cursor-pointer border-primary-800"
                  />
                  <span className="ml-2 text-sm text-gray-600">Selecionar</span>
                </div>
              )}
              {renderMobileCard(item, index)}
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto shadow-md rounded-lg ${className}`}>
      <Table>
        <TableHead>
          {selectable && (
            <TableHeadCell className="p-4 bg-primary-300">
              <Checkbox
                checked={allSelected}
                ref={(input) => {
                  if (input) input.indeterminate = someSelected;
                }}
                onChange={onSelectAll}
                className="text-primary-800 focus:ring-primary-200 cursor-pointer border-primary-800"
              />
            </TableHeadCell>
          )}
          {columns.map((column, index) => (
            <TableHeadCell key={index} className="bg-primary-300 text-white">
              {column.label}
            </TableHeadCell>
          ))}
        </TableHead>
        <TableBody className="divide-y">
          {data.length === 0 ? (
            <TableRow className="bg-primary-200 text-white">
              <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={index} className="bg-primary-50 text-primary-800">
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id || index)}
                      onChange={() => onSelectItem(item.id || index)}
                      className="text-primary-800 focus:ring-primary-200 cursor-pointer border-primary-800"
                    />
                  </TableCell>
                )}
                {renderRow(item, index)}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
