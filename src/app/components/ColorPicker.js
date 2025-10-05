/**
 * COMPONENTE DE SELEÇÃO DE COR
 * 
 * Este arquivo contém um componente simples para seleção de cores que permite
 * ao usuário escolher cores através de um input de tipo color nativo do navegador.
 * O componente é usado para personalizar as cores do catálogo.
 * 
 * Funcionalidades:
 * - Seleção de cor nativa do navegador
 * - Label associado ao input
 * - Estado desabilitado
 * - Estilização personalizada
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { Label } from "flowbite-react"; // Importa o componente Label do Flowbite

export default function ColorPicker({ 
    label, // Texto do label
    value, // Valor da cor selecionada
    onChange, // Função chamada quando a cor muda
    name, // Nome do input
    disabled = false, // Se o input está desabilitado
    className = "" // Classes CSS adicionais
}) {
    return (
        <div className={`p-2 inline-flex items-center space-x-2 ${className}`}>
            {/* Label do seletor de cor */}
            <Label 
                htmlFor={name} // Associa o label ao input
                value={label} // Texto do label
            />
            {/* Input nativo de seleção de cor */}
            <input 
                value={value} // Valor atual da cor
                aria-disabled={disabled} // Atributo de acessibilidade para estado desabilitado
                name={name} // Nome do input
                className="bg-gray-100 border rounded p-0 w-12 h-8 cursor-pointer" // Estilos do input
                type="color" // Tipo de input para seleção de cor
                onChange={onChange} // Função chamada quando a cor muda
            />
        </div>
    );
}
