'use client'
// Importação do hook useState do React
import { useState } from "react";
// Importação de ícones para adicionar e remover
import { HiPlus, HiTrash } from "react-icons/hi";
// Importação de componentes do Flowbite React
import { Button, Label } from "flowbite-react";

/**
 * Componente para gerenciar variações de produtos (cores, tamanhos, etc.)
 * Permite criar tipos de variação e adicionar múltiplas variantes para cada tipo
 * @param {Array} variations - Array com as variações existentes do produto
 * @param {Function} setVariations - Função para atualizar as variações
 * @returns {JSX.Element} Interface para gerenciar variações de produto
 */
export default function CreateProductVariants({variations, setVariations}) {
    // Estado para o nome da nova variação a ser criada
    const [newVariationName, setNewVariationName] = useState('');
    // Estado para armazenar os inputs temporários de variantes
    const [variantInputs, setVariantInputs] = useState({});
  
    /**
     * Função para adicionar uma nova variação (ex: "Cor", "Tamanho")
     * Cria uma nova categoria de variação com array vazio de variantes
     */
    const addVariation = () => {
      if (newVariationName.trim() === '') return;  // Valida se o nome não está vazio
      const newVariation = {
        name: newVariationName.trim(),  // Remove espaços em branco
        variants: [],                   // Inicia com array vazio de variantes
      };
      setVariations([...variations, newVariation]);  // Adiciona à lista existente
      setNewVariationName('');  // Limpa o campo de input
    };

    /**
     * Função para adicionar uma variante específica a uma variação
     * @param {number} index - Índice da variação na lista
     */
    const addVariant = (index) => {
      const variantName = variantInputs[index] || '';  // Obtém o nome do input temporário
      if (variantName.trim() === '') return;  // Valida se o nome não está vazio
      const updatedVariations = [...variations];  // Cria cópia das variações
      updatedVariations[index].variants.push(variantName.trim());  // Adiciona variante
      setVariations(updatedVariations);  // Atualiza estado
      // Remove o input temporário usado
      setVariantInputs(prev => {
        const newInputs = {...prev};
        delete newInputs[index];
        return newInputs;
      });
    };

    /**
     * Função para deletar uma variação completa
     * @param {number} index - Índice da variação a ser removida
     */
    const deleteVariation = (index) => {
      const updatedVariations = [...variations];  // Cria cópia das variações
      updatedVariations.splice(index, 1);  // Remove a variação do array
      setVariations(updatedVariations);  // Atualiza estado
      // Limpar o input correspondente se existir
      setVariantInputs(prev => {
        const newInputs = {...prev};
        delete newInputs[index];
        return newInputs;
      });
    };

    /**
     * Função para deletar uma variante específica de uma variação
     * @param {number} vIndex - Índice da variante na lista de variantes
     * @param {number} index - Índice da variação na lista de variações
     */
    const deleteVariant = (vIndex, index) => {
      const updatedVariations = [...variations];  // Cria cópia das variações
      updatedVariations[index].variants.splice(vIndex, 1);  // Remove a variante
      setVariations(updatedVariations);  // Atualiza estado
    };
  
    // Renderiza a interface de gerenciamento de variações
    return (
      <div>
        {/* Label da seção de variações */}
        <Label
        className="text-base"
        value="Variações do produto" />

        {/* Formulário para adicionar nova variação */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Exemplo: Cor"
            value={newVariationName}
            onChange={(e) => setNewVariationName(e.target.value)}
            className="border border-gray-300 px-3 py-2 w-full rounded-md mr-2 text-sm"
          />
          <Button onClick={addVariation} className="duration-200 bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full mt-2">
            Adicionar Variação
          </Button>
        </div>

        {/* Renderiza cada variação existente */}
        {variations.map((variation, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              {/* Nome da variação */}
              <h3 className="font-semibold mb-2 text-base">{variation.name}</h3>
              {/* Botão para deletar a variação */}
              <Button onClick={() => deleteVariation(index)} className="duration-200 text-red-300 bg-red-600 hover:!bg-red-500 focus:!ring-red-400">
                <HiTrash className="w-4 h-4"/>
              </Button>
            </div>

            {/* Formulário para adicionar variantes à variação */}
            <div className="flex mb-2">
              <input
                type="text"
                placeholder="Exemplo: Preto/Branco"
                value={variantInputs[index] || ''}
                onChange={(e) => setVariantInputs(prev => ({
                  ...prev,
                  [index]: e.target.value
                }))}
                className="border border-gray-300 px-3 py-2 w-full rounded-md mr-2 text-sm"
              />
              <Button
                onClick={() => addVariant(index)}
                className="duration-200 bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full"
              >
                <HiPlus/>Adicionar Variante
              </Button>
            </div>

            {/* Lista de variantes existentes para esta variação */}
            <ul>
              {variation.variants.map((variant, vIndex) => (
                <li key={vIndex} className="inline-flex bg-lightcyan p-1.5 border-2 border-cornflowerblue rounded-lg m-2 text-sm items-center">
                  {variant}
                  {/* Botão para deletar variante individual */}
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
