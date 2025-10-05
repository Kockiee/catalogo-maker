/**
 * COMPONENTE DE INPUT DE PREÇO
 * 
 * Este arquivo contém um componente especializado para entrada de valores monetários
 * em reais brasileiros. O componente formata automaticamente o valor para o padrão
 * brasileiro (R$ 0,00) e converte para número para armazenamento.
 * 
 * Funcionalidades:
 * - Formatação automática para moeda brasileira
 * - Conversão de string para número
 * - Validação de entrada (apenas números)
 * - Placeholder personalizado
 * - Estados desabilitado e obrigatório
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { Label, TextInput } from "flowbite-react"; // Importa componentes do Flowbite

export default function PriceInput({ 
    label, // Texto do label
    name, // Nome do campo
    id, // ID do campo
    value, // Valor atual (número)
    onChange, // Função chamada quando o valor muda
    placeholder = "R$ 0,00", // Placeholder padrão
    required = false, // Se o campo é obrigatório
    disabled = false, // Se o campo está desabilitado
    className = "" // Classes CSS adicionais
}) {
    // Função para lidar com mudanças no input de preço
    const handlePriceChange = (e) => {
        const inputValue = e.target.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
        
        // Converte para formato de moeda brasileira
        const valueInBRL = (inputValue / 100).toLocaleString('pt-BR', { 
            style: 'currency', // Formato de moeda
            currency: 'BRL' // Moeda brasileira
        });
        
        // Atualiza o valor visual do input
        e.target.value = valueInBRL;
        
        // Calcula o valor numérico para o estado
        const numericString = valueInBRL.replace(/[^\d,]/g, ''); // Remove tudo exceto dígitos e vírgula
        const replacedComma = numericString.replace(',', '.'); // Substitui vírgula por ponto
        const formattedValue = parseFloat(replacedComma); // Converte para número
        
        // Chama o onChange com o valor numérico
        onChange(formattedValue);
    };

    return (
        <div className={`py-2 w-full ${className}`}>
            {/* Label do campo */}
            <Label 
                htmlFor={id} // Associa o label ao input
                value={label} // Texto do label
            />
            {/* Input de preço com formatação */}
            <TextInput
                color="light" // Cor do tema
                name={name} // Nome do campo
                id={id} // ID do campo
                type="text" // Tipo texto para permitir formatação
                placeholder={placeholder} // Texto placeholder
                aria-disabled={disabled} // Atributo de acessibilidade
                required={required} // Se é obrigatório
                onChange={handlePriceChange} // Função de formatação
                className="focus:ring-primary-200 focus:border-primary-300" // Classes de foco
                defaultValue={value ? value.toLocaleString('pt-BR', { 
                    style: 'currency', // Formato de moeda
                    currency: 'BRL' // Moeda brasileira
                }) : ''} // Valor inicial formatado
            />
        </div>
    );
}
