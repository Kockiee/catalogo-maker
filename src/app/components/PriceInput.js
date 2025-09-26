'use client' // Diretiva para indicar que este código executa no cliente
import { Label, TextInput } from "flowbite-react"; // Importação de componentes do Flowbite React

/**
 * Componente de entrada de preço formatado em reais (BRL).
 * 
 * @param {string} label - Rótulo do campo de entrada
 * @param {string} name - Nome do campo para submissão de formulário
 * @param {string} id - ID único do campo
 * @param {number} value - Valor inicial do campo em formato numérico
 * @param {Function} onChange - Função chamada ao alterar o valor do campo
 * @param {string} placeholder - Texto de placeholder exibido no campo
 * @param {boolean} required - Define se o campo é obrigatório
 * @param {boolean} disabled - Define se o campo está desabilitado
 * @param {string} className - Classes CSS adicionais
 */
export default function PriceInput({ 
    label, // Rótulo do campo
    name, // Nome do campo para formulários
    id, // ID único para o campo
    value, // Valor inicial do campo
    onChange, // Callback para mudanças no valor
    placeholder = "R$ 0,00", // Placeholder padrão
    required = false, // Estado de obrigatório
    disabled = false, // Estado de desabilitado
    className = "" // Classes CSS adicionais
}) {
    // Função para lidar com mudanças no valor do campo
    const handlePriceChange = (e) => {
        const inputValue = e.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        const valueInBRL = (inputValue / 100).toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' // Formata o valor como moeda brasileira
        });
        
        // Atualiza o valor visual do input
        e.target.value = valueInBRL;
        
        // Calcula o valor numérico para o estado
        const numericString = valueInBRL.replace(/[^\d,]/g, ''); // Remove caracteres não numéricos e vírgulas
        const replacedComma = numericString.replace(',', '.'); // Substitui vírgula por ponto
        const formattedValue = parseFloat(replacedComma); // Converte para número de ponto flutuante
        
        // Chama o onChange com o valor numérico
        onChange(formattedValue);
    };

    return (
        <div className={`py-2 w-full ${className}`}> {/* Container principal */}
            <Label 
                htmlFor={id} // Associa o rótulo ao campo pelo ID
                value={label} // Texto do rótulo
            />
            <TextInput
                color="blue" // Cor do campo
                name={name} // Nome do campo
                id={id} // ID único
                type="text" // Tipo de entrada como texto
                placeholder={placeholder} // Placeholder exibido no campo
                aria-disabled={disabled} // Atributo de acessibilidade para estado desabilitado
                required={required} // Define se o campo é obrigatório
                onChange={handlePriceChange} // Callback para mudanças no valor
                defaultValue={value ? value.toLocaleString('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' // Formata o valor inicial como moeda brasileira
                }) : ''} // Valor inicial formatado ou vazio
            />
        </div>
    );
}
