'use client'
import { useState } from "react";
import { HiPlus, HiTrash } from "react-icons/hi"; // Importando o ícone de lixeira
import { Button, Label } from "flowbite-react";

export default function CreateProductVariants({variations, setVariations}) {
    const [newVariationName, setNewVariationName] = useState('');
    const [newVariantName, setNewVariantName] = useState('');
  
    const addVariation = () => {
      if (newVariationName.trim() === '') return;
      const newVariation = {
        name: newVariationName.trim(),
        variants: [],
      };
      setVariations([...variations, newVariation]);
      setNewVariationName('');
    };
  
    const addVariant = (index) => {
      if (newVariantName.trim() === '') return;
      const updatedVariations = [...variations];
      updatedVariations[index].variants.push(newVariantName.trim());
      setVariations(updatedVariations);
      setNewVariantName('');
    };

    const deleteVariation = (index) => {
      const updatedVariations = [...variations];
      updatedVariations.splice(index, 1);
      setVariations(updatedVariations);
    };

    const deleteVariant = (vIndex, index) => {
      const updatedVariations = [...variations];
      updatedVariations[index].variants.splice(vIndex, 1);
      setVariations(updatedVariations);
    };
  
    return (
      <div>
        <Label 
        className="text-base" 
        value="Variações do produto" />
        <div className="mb-4">
          <input
            type="text"
            placeholder="Exemplo: Cor"
            value={newVariationName}
            onChange={(e) => setNewVariationName(e.target.value)}
            className="border border-gray-300 px-3 py-2 w-full rounded-md mr-2 text-sm"
          />
          <Button onClick={addVariation} className="bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full mt-2">
            Adicionar Variação
          </Button>
        </div>
        {variations.map((variation, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center justify-between mb-2"> {/* Adicionando div para botão de exclusão */}
              <h3 className="font-semibold mb-2 text-base">{variation.name}</h3>
              <Button onClick={() => deleteVariation(index)} className="text-red-300 bg-red-600 hover:!bg-red-500 focus:!ring-red-400"> {/* Botão de exclusão */}
                <HiTrash className="w-4 h-4"/>
              </Button>
            </div>
            <div className="flex mb-2">
              <input
                type="text"
                placeholder="Exemplo: Preto/Branco"
                value={newVariantName}
                onChange={(e) => setNewVariantName(e.target.value)}
                className="border border-gray-300 px-3 py-2 w-full rounded-md mr-2 text-sm"
              />
              <Button
                onClick={() => addVariant(index)}
                className="bg-neonblue hover:!bg-neonblue/80 focus:ring-jordyblue w-full"
              >
                <HiPlus/>Adicionar Variante
              </Button>
            </div>
            <ul>
              {variation.variants.map((variant, vIndex) => (
                <li key={vIndex} className="inline-flex bg-lightcyan p-1.5 border-2 border-cornflowerblue rounded-lg m-2 text-sm items-center">
                  {variant}
                  <Button onClick={() => deleteVariant(vIndex, index)} className="text-red-300 bg-red-600 hover:!bg-red-500 focus:!ring-red-400 ml-2 !p-0">
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
