'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BiEdit } from "react-icons/bi";
import { HiPlus, HiTrash } from "react-icons/hi";
import ButtonAPP from './ButtonAPP';

export default function ActionButtons({ 
  selectedCount = 0,
  onDelete,
  onCreateHref,
  onEditHref,
  createLabel = "Criar",
  editLabel = "Editar",
  deleteLabel = "Deletar",
  showCreate = true,
  showEdit = true,
  showDelete = true,
  className = ""
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className={`fixed bottom-6 left-0 z-50 flex justify-center w-full ${className}`}>
        <div className="flex flex-row bg-primary-50 border-primary-200 border-4 rounded-xl justify-around shadow-lg px-4 py-2">
          {selectedCount > 0 && showDelete && (
            <ButtonAPP
              onClick={onDelete}
              className="px-4 py-2"
              negative
            >
              <HiTrash className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{deleteLabel}</span>
            </ButtonAPP>
          )}
          
          {showCreate && (
            <Link href={onCreateHref}>
              <ButtonAPP className="px-4 py-2">
                <HiPlus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{createLabel}</span>
              </ButtonAPP>
            </Link>
          )}
          
          {selectedCount === 1 && showEdit && (
            <Link href={onEditHref}>
              <ButtonAPP className="px-4 py-2">
                <BiEdit className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{editLabel}</span>
              </ButtonAPP>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center space-x-2 ${className}`}>
      {selectedCount > 0 && showDelete && (
        <ButtonAPP
          onClick={onDelete}
          className="m-2"
          negative
        >
          <HiTrash className="w-5 h-5 mr-1" />
          {deleteLabel}
        </ButtonAPP>
      )}
      
      {showCreate && (
        <Link href={onCreateHref}>
          <ButtonAPP className="m-2">
            <HiPlus className="w-5 h-5 mr-1" />
            {createLabel}
          </ButtonAPP>
        </Link>
      )}
      
      {selectedCount === 1 && showEdit && (
        <Link href={onEditHref}>
          <ButtonAPP className="m-2">
            <BiEdit className="w-5 h-5 mr-1" />
            {editLabel}
          </ButtonAPP>
        </Link>
      )}
    </div>
  );
}
