'use client' // Diretiva para indicar que este código executa no cliente
import { Label } from "flowbite-react"; // Importação do componente Label da biblioteca Flowbite React

/**
 * Componente de seleção de cores
 * Permite ao usuário escolher uma cor através de um seletor de cores padrão do navegador
 * 
 * @param {string} label - Texto de identificação do seletor de cores
 * @param {string} value - Valor atual da cor (formato hexadecimal)
 * @param {Function} onChange - Função chamada quando a cor é alterada
 * @param {string} name - Nome do campo para identificação no formulário
 * @param {boolean} disabled - Define se o seletor está desabilitado
 * @param {string} className - Classes CSS adicionais para o container
 */
export default function ColorPicker({ 
    label, 
    value, 
    onChange, 
    name, 
    disabled = false,
    className = ""
}) {
    return (
        <div className={`p-2 inline-flex items-center space-x-2 ${className}`}> {/* Container com espaçamento e alinhamento */}
            <Label 
                htmlFor={name} // Associa o label ao input pelo nome
                value={label} // Texto do label
            />
            <input 
                value={value} // Valor atual da cor
                aria-disabled={disabled} // Propriedade de acessibilidade para indicar estado desabilitado
                name={name} // Nome do campo para formulários
                className="bg-gray-100 border rounded p-0 w-12 h-8 cursor-pointer" // Estilização do seletor de cores
                type="color" // Define o tipo do input como seletor de cores
                onChange={onChange} // Manipulador de evento quando a cor é alterada
            />
        </div>
    );
}
