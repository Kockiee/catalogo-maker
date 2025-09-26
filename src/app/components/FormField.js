'use client' // Diretiva para indicar que este código executa no cliente
import { Label, TextInput, Textarea } from "flowbite-react"; // Importação de componentes do Flowbite React

/**
 * Componente de campo de formulário reutilizável que suporta diferentes tipos de entrada
 * 
 * @param {string} type - Tipo do campo (text, email, password, textarea, etc)
 * @param {string} label - Rótulo do campo
 * @param {string} name - Nome do campo para submissão de formulário
 * @param {string} id - ID único do campo
 * @param {string|number} value - Valor atual do campo
 * @param {Function} onChange - Função chamada quando o valor muda
 * @param {string} placeholder - Texto de placeholder
 * @param {boolean} required - Se o campo é obrigatório
 * @param {boolean} disabled - Se o campo está desabilitado
 * @param {number} maxLength - Número máximo de caracteres
 * @param {number} rows - Número de linhas para textarea
 * @param {string} className - Classes CSS adicionais
 * @param {boolean} shadow - Se deve aplicar sombra ao campo
 */
export default function FormField({ 
    type = "text", // Tipo do campo, padrão é texto
    label, // Rótulo do campo
    name, // Nome do campo para formulários
    id, // ID único para o campo
    value, // Valor atual do campo
    onChange, // Handler para mudanças no campo
    placeholder, // Texto de placeholder
    required = false, // Se o campo é obrigatório
    disabled = false, // Se o campo está desabilitado
    maxLength, // Limite máximo de caracteres
    rows, // Número de linhas para textarea
    className = "", // Classes CSS adicionais
    shadow = true // Se deve aplicar sombra ao campo
}) {
    // Propriedades comuns para TextInput e Textarea
    const commonProps = {
        value,
        onChange,
        color: "light", // Tema claro para os campos
        name,
        id,
        placeholder,
        required,
        "aria-disabled": disabled, // Atributo de acessibilidade
        className: type === "textarea" ? 'focus:ring-jordyblue focus:border-none focus:ring-2' : className
    };

    // Adiciona sombra apenas para campos que não são textarea
    if (shadow && type !== "textarea") {
        commonProps.shadow = true;
    }

    // Adiciona limite de caracteres se especificado
    if (maxLength) {
        commonProps.maxLength = maxLength;
    }

    // Adiciona número de linhas apenas para textarea
    if (rows && type === "textarea") {
        commonProps.rows = rows;
    }

    return (
        <div className="py-2 w-full"> {/* Container do campo com espaçamento */}
            <Label 
                htmlFor={id} 
                value={label} 
            />
            {/* Renderiza Textarea ou TextInput baseado no tipo */}
            {type === "textarea" ? (
                <Textarea {...commonProps} />
            ) : (
                <TextInput 
                    {...commonProps}
                    type={type}
                />
            )}
        </div>
    );
}
