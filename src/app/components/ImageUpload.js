/**
 * COMPONENTE DE UPLOAD DE IMAGEM SIMPLES
 * 
 * Este arquivo contém um componente simples para upload de imagens que
 * estende o FileInput do Flowbite com configurações específicas para
 * upload de imagens no Catálogo Maker.
 * 
 * Funcionalidades:
 * - Upload de imagem única ou múltiplas
 * - Validação de tipo de arquivo
 * - Estados desabilitado e obrigatório
 * - Texto de ajuda
 * - Interface consistente
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { Label, FileInput } from "flowbite-react"; // Importa componentes do Flowbite

export default function ImageUpload({ 
    label, // Texto do label
    name, // Nome do campo
    id, // ID do campo
    onChange, // Função chamada quando arquivos são selecionados
    disabled = false, // Se o componente está desabilitado
    required = false, // Se o campo é obrigatório
    accept = "image/*", // Tipos de arquivo aceitos
    helperText, // Texto de ajuda
    multiple = false // Se permite múltiplos arquivos
}) {
    return (
        <div className="py-2 w-full">
            {/* Label do campo */}
            <Label 
                htmlFor={id} // Associa o label ao input
                value={label} // Texto do label
            />
            {/* Input de arquivo para upload */}
            <FileInput
                aria-disabled={disabled} // Atributo de acessibilidade para estado desabilitado
                name={name} // Nome do campo
                color="light" // Cor do tema
                id={id} // ID do campo
                accept={accept} // Tipos de arquivo aceitos
                onChange={onChange} // Função chamada quando arquivos são selecionados
                helperText={helperText} // Texto de ajuda
                required={required} // Se é obrigatório
                multiple={multiple} // Se permite múltiplos arquivos
            />
        </div>
    );
}
