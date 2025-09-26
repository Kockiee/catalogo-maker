'use client' // Diretiva para indicar que este código executa no cliente
import { Label, FileInput } from "flowbite-react"; // Importação de componentes do Flowbite React

/**
 * Componente de upload de imagem que permite selecionar e enviar arquivos de imagem.
 * 
 * @param {string} label - Rótulo do campo de upload
 * @param {string} name - Nome do campo para submissão de formulário
 * @param {string} id - ID único do campo
 * @param {Function} onChange - Função chamada ao alterar o arquivo selecionado
 * @param {boolean} disabled - Define se o campo está desabilitado
 * @param {boolean} required - Define se o campo é obrigatório
 * @param {string} accept - Tipos de arquivos aceitos (padrão: "image/*")
 * @param {string} helperText - Texto auxiliar exibido abaixo do campo
 * @param {boolean} multiple - Permite múltiplas seleções de arquivos
 */
export default function ImageUpload({ 
    label, // Rótulo do campo
    name, // Nome do campo para formulários
    id, // ID único para o campo
    onChange, // Callback para mudanças no arquivo selecionado
    disabled = false, // Estado de desabilitado
    required = false, // Estado de obrigatório
    accept = "image/*", // Tipos de arquivos aceitos
    helperText, // Texto auxiliar
    multiple = false // Permite múltiplas seleções
}) {
    return (
        <div className="py-2 w-full"> {/* Container principal */}
            <Label 
                htmlFor={id} // Associa o rótulo ao campo pelo ID
                value={label} // Texto do rótulo
            />
            <FileInput
                aria-disabled={disabled} // Atributo de acessibilidade para estado desabilitado
                name={name} // Nome do campo
                color="light" // Tema claro
                id={id} // ID único
                accept={accept} // Tipos de arquivos aceitos
                onChange={onChange} // Callback para mudanças no arquivo
                helperText={helperText} // Texto auxiliar
                required={required} // Define se o campo é obrigatório
                multiple={multiple} // Permite múltiplas seleções
            />
        </div>
    );
}
