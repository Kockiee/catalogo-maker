'use client'
import { Label, TextInput } from "flowbite-react";

export default function PriceInput({ 
    label,
    name,
    id,
    value,
    onChange,
    placeholder = "R$ 0,00",
    required = false,
    disabled = false,
    className = ""
}) {
    const handlePriceChange = (e) => {
        const inputValue = e.target.value.replace(/\D/g, '');
        const valueInBRL = (inputValue / 100).toLocaleString('pt-BR', { 
            style: 'currency', 
            currency: 'BRL' 
        });
        
        // Atualiza o valor visual do input
        e.target.value = valueInBRL;
        
        // Calcula o valor numérico para o estado
        const numericString = valueInBRL.replace(/[^\d,]/g, '');
        const replacedComma = numericString.replace(',', '.');
        const formattedValue = parseFloat(replacedComma);
        
        // Chama o onChange com o valor numérico
        onChange(formattedValue);
    };

    return (
        <div className={`py-2 w-full ${className}`}>
            <Label 
                htmlFor={id} 
                value={label} 
            />
            <TextInput
                color="blue"
                name={name}
                id={id}
                type="text"
                placeholder={placeholder}
                aria-disabled={disabled}
                required={required}
                onChange={handlePriceChange}
                defaultValue={value ? value.toLocaleString('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                }) : ''}
            />
        </div>
    );
}
