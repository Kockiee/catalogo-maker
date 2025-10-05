/**
 * COMPONENTE DE CAMPO DE FORMULÁRIO
 * 
 * Este arquivo contém um componente reutilizável para campos de formulário que
 * suporta tanto inputs de texto quanto textareas. O componente unifica a
 * interface e comportamento de diferentes tipos de campos de entrada.
 * 
 * Funcionalidades:
 * - Suporte a diferentes tipos de input (text, email, password, etc.)
 * - Suporte a textarea com configuração de linhas
 * - Validação de campos obrigatórios
 * - Limite de caracteres
 * - Estados desabilitado e com sombra
 * - Estilização consistente
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { Label, TextInput, Textarea } from "flowbite-react"; // Importa componentes do Flowbite

export default function FormField({ 
    type = "text", // Tipo do input (text, email, password, etc.)
    label, // Texto do label
    name, // Nome do campo
    id, // ID do campo
    value, // Valor atual do campo
    onChange, // Função chamada quando o valor muda
    placeholder, // Texto placeholder
    required = false, // Se o campo é obrigatório
    disabled = false, // Se o campo está desabilitado
    maxLength, // Limite máximo de caracteres
    rows, // Número de linhas para textarea
    className = "", // Classes CSS adicionais
    shadow = true // Se deve aplicar sombra ao input
}) {
    // Propriedades comuns para todos os tipos de input
    const commonProps = {
        value, // Valor atual
        onChange, // Função de mudança
        color: "light", // Cor do tema
        name, // Nome do campo
        id, // ID do campo
        placeholder, // Texto placeholder
        required, // Se é obrigatório
        "aria-disabled": disabled, // Atributo de acessibilidade
        className: type === "textarea" ? 'focus:ring-primary-200 focus:border-primary-300 focus:ring-2' : className // Classes específicas para textarea
    };

    // Aplica sombra se habilitada e não for textarea
    if (shadow && type !== "textarea") {
        commonProps.shadow = true;
    }

    // Adiciona limite de caracteres se especificado
    if (maxLength) {
        commonProps.maxLength = maxLength;
    }

    // Adiciona número de linhas para textarea
    if (rows && type === "textarea") {
        commonProps.rows = rows;
    }

    return (
        <div className="py-2 w-full">
            {/* Label do campo */}
            <Label 
                htmlFor={id} // Associa o label ao input
                value={label} // Texto do label
            />
            {/* Renderiza textarea ou input baseado no tipo */}
            {type === "textarea" ? (
                <Textarea {...commonProps} /> {/* Textarea com todas as propriedades */}
            ) : (
                <TextInput 
                    {...commonProps} // Todas as propriedades comuns
                    type={type} // Tipo específico do input
                />
            )}
        </div>
    );
}
