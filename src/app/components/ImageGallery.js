/**
 * COMPONENTE DE GALERIA DE IMAGENS
 * 
 * Este arquivo contém um componente para upload e gerenciamento de múltiplas imagens.
 * O componente permite visualizar, adicionar e remover imagens com uma interface
 * intuitiva e responsiva.
 * 
 * Funcionalidades:
 * - Upload de múltiplas imagens
 * - Preview das imagens carregadas
 * - Remoção individual de imagens
 * - Limite máximo de imagens
 * - Suporte a imagens existentes e novas
 * - Interface responsiva
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { Label, FileInput } from "flowbite-react"; // Importa componentes do Flowbite
import Image from 'next/image'; // Importa componente Image otimizado do Next.js
import { HiTrash } from "react-icons/hi"; // Importa ícone de lixeira

export default function ImageGallery({ 
    label, // Texto do label
    name, // Nome do campo
    id, // ID do campo
    images = [], // Array de imagens atuais
    onImagesChange, // Função chamada quando as imagens mudam
    onImageRemove, // Função chamada quando uma imagem é removida
    disabled = false, // Se o componente está desabilitado
    required = false, // Se o campo é obrigatório
    multiple = true, // Se permite múltiplas imagens
    maxImages = 10, // Limite máximo de imagens
    helperText, // Texto de ajuda
    className = "" // Classes CSS adicionais
}) {
    // Função para lidar com mudanças no input de arquivo
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // Converte FileList para Array
        
        // Verifica se não excede o limite máximo de imagens
        if (files.length + images.length > maxImages) {
            // Você pode passar um callback de erro aqui se necessário
            return;
        }
        
        // Processa cada arquivo selecionado
        const newImages = files.map(file => {
            const reader = new FileReader(); // Cria leitor de arquivo
            return new Promise((resolve) => {
                reader.onloadend = () => {
                    resolve({
                        file, // Arquivo original
                        url: reader.result, // URL da imagem em base64
                        id: Date.now() + Math.random(), // ID único temporário
                        isExisting: false // Marca como nova imagem
                    });
                };
                reader.readAsDataURL(file); // Lê o arquivo como base64
            });
        });
        
        // Aguarda todas as imagens serem processadas e atualiza o estado
        Promise.all(newImages).then(resolvedImages => {
            onImagesChange([...images, ...resolvedImages]); // Adiciona novas imagens às existentes
        });
    };

    // Função para remover uma imagem específica
    const handleImageRemove = (index) => {
        const imageToRemove = images[index]; // Pega a imagem que será removida
        const newImages = images.filter((_, i) => i !== index); // Remove a imagem do array
        
        onImagesChange(newImages); // Atualiza o estado com as imagens restantes
        
        // Se há callback para remoção (útil para EditProduct)
        if (onImageRemove) {
            onImageRemove(imageToRemove, index); // Chama callback com a imagem removida e índice
        }
    };

    return (
        <div className={`py-2 w-full ${className}`}>
            {/* Label do campo */}
            <Label 
                htmlFor={id} // Associa o label ao input
                value={label} // Texto do label
            />
            {/* Galeria de preview das imagens */}
            <div className="flex-wrap flex justify-center items-center mb-2">
                {images.map((image, index) => (
                    <div key={image.id || index} className="relative">
                        {/* Imagem com tamanho fixo */}
                        <Image 
                            src={image.url} // URL da imagem
                            width={100} // Largura da imagem
                            height={100} // Altura da imagem
                            className="size-24 m-1 rounded-lg" // Classes de estilo
                            alt={`Imagem ${index + 1}`} // Texto alternativo
                        />
                        {/* Botão de remover imagem */}
                        <button
                            type="button"
                            onClick={() => handleImageRemove(index)} // Remove a imagem no índice específico
                            disabled={disabled} // Desabilita se o componente está desabilitado
                            className="bg-cornflowerblue hover:bg-cornflowerblue/80 p-1 absolute right-1 bottom-1 disabled:opacity-50"
                        >
                            <HiTrash className="w-4 h-4"/> {/* Ícone de lixeira */}
                        </button>
                    </div>
                ))}
            </div>
            {/* Input de arquivo para upload */}
            <FileInput
                required={required} // Se é obrigatório
                multiple={multiple} // Se permite múltiplos arquivos
                aria-disabled={disabled} // Atributo de acessibilidade
                name={name} // Nome do campo
                color="light" // Cor do tema
                id={id} // ID do campo
                accept="image/*" // Aceita apenas imagens
                onChange={handleFileChange} // Função chamada quando arquivos são selecionados
                helperText={helperText} // Texto de ajuda
            />
        </div>
    );
}
