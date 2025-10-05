/**
 * Container de variações de produtos
 * 
 * Este arquivo contém o componente que gerencia as variações
 * de um produto, permitindo adicionar, editar e excluir
 * variações e suas opções. É usado na criação e edição
 * de produtos para definir características como cor, tamanho, etc.
 * 
 * Funcionalidades principais:
 * - Adição de novas variações (cor, tamanho, etc.)
 * - Gerenciamento de opções para cada variação
 * - Exclusão de variações e opções
 * - Interface intuitiva com botões de ação
 * - Validação de dados
 */

'use client'
// Importa hook useState do React
import { useState } from "react";
// Importa ícones do Heroicons
import { HiPlus, HiTrash } from "react-icons/hi"; // Importando o ícone de lixeira
// Importa componentes do Flowbite
import { Button, Label } from "flowbite-react";

// Componente principal de variações de produtos
export default function CreateProductVariants({variations, setVariations}) {
    // Estado para o nome da nova variação
    const [newVariationName, setNewVariationName] = useState('');
    // Estado para os inputs de variantes (índice -> valor)
    const [variantInputs, setVariantInputs] = useState({});
  
    // Função que adiciona uma nova variação
    const addVariation = () => {
      if (newVariationName.trim() === '') return; // Não adiciona se nome estiver vazio
      const newVariation = {
        name: newVariationName.trim(), // Nome da variação
        variants: [], // Lista de opções vazia
      };
      setVariations([...variations, newVariation]); // Adiciona à lista
      setNewVariationName(''); // Limpa o input
    };
  
    // Função que adiciona uma opção a uma variação específica
    const addVariant = (index) => {
      const variantName = variantInputs[index] || '';
      if (variantName.trim() === '') return; // Não adiciona se nome estiver vazio
      const updatedVariations = [...variations];
      updatedVariations[index].variants.push(variantName.trim()); // Adiciona à lista de opções
      setVariations(updatedVariations); // Atualiza estado
      setVariantInputs(prev => {
        const newInputs = {...prev};
        delete newInputs[index]; // Remove o input específico
        return newInputs;
      });
    };

    // Função que exclui uma variação inteira
    const deleteVariation = (index) => {
      const updatedVariations = [...variations];
      updatedVariations.splice(index, 1); // Remove a variação
      setVariations(updatedVariations); // Atualiza estado
      // Limpar o input correspondente
      setVariantInputs(prev => {
        const newInputs = {...prev};
        delete newInputs[index]; // Remove o input específico
        return newInputs;
      });
    };

    // Função que exclui uma opção específica de uma variação
    const deleteVariant = (vIndex, index) => {
      const updatedVariations = [...variations];
      updatedVariations[index].variants.splice(vIndex, 1); // Remove a opção
      setVariations(updatedVariations); // Atualiza estado
    };
  
    return (
      <div>
        {/* Label principal do componente */}
        <Label 
        className="text-base" 
        value="Variações do produto" />
        {/* Container para adicionar nova variação */}
        <div className="mb-4">
          {/* Input para nome da nova variação */}
          <input
            type="text"
            placeholder="Exemplo: Cor"
            value={newVariationName}
            onChange={(e) => setNewVariationName(e.target.value)} // Atualiza estado
            className="border border-gray-300 px-3 py-2 w-full rounded-md mr-2 text-sm"
          />
          {/* Botão para adicionar variação */}
          <Button onClick={addVariation} className="duration-200 bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full mt-2">
            Adicionar Variação
          </Button>
        </div>
        {/* Mapeia cada variação existente */}
        {variations.map((variation, index) => (
          <div key={index} className="mb-4">
            {/* Header da variação com nome e botão de exclusão */}
            <div className="flex items-center justify-between mb-2"> {/* Adicionando div para botão de exclusão */}
              <h3 className="font-semibold mb-2 text-base">{variation.name}</h3>
              {/* Botão para excluir variação inteira */}
              <Button onClick={() => deleteVariation(index)} className="duration-200 text-red-300 bg-red-600 hover:!bg-red-500 focus:!ring-red-400"> {/* Botão de exclusão */}
                <HiTrash className="w-4 h-4"/>
              </Button>
            </div>
            {/* Container para adicionar nova opção */}
            <div className="flex mb-2">
              {/* Input para nova opção */}
              <input
                type="text"
                placeholder="Exemplo: Preto/Branco"
                value={variantInputs[index] || ''}
                onChange={(e) => setVariantInputs(prev => ({
                  ...prev,
                  [index]: e.target.value // Atualiza input específico
                }))}
                className="border border-gray-300 px-3 py-2 w-full rounded-md mr-2 text-sm"
              />
              {/* Botão para adicionar opção */}
              <Button
                onClick={() => addVariant(index)}
                className="duration-200 bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full"
              >
                <HiPlus/>Adicionar Variante
              </Button>
            </div>
            {/* Lista de opções existentes */}
            <ul>
              {variation.variants.map((variant, vIndex) => (
                <li key={vIndex} className="inline-flex bg-lightcyan p-1.5 border-2 border-cornflowerblue rounded-lg m-2 text-sm items-center">
                  {variant}
                  {/* Botão para excluir opção específica */}
                  <Button onClick={() => deleteVariant(vIndex, index)} className="duration-200 text-red-300 bg-red-600 hover:!bg-red-500 focus:!ring-red-400 ml-2 !p-0">
                    <HiTrash className="w-4 h-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
}
