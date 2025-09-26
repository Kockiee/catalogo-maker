'use client' // Diretiva para indicar que este código executa no cliente
import { Label, FileInput } from "flowbite-react"; // Importação de componentes do Flowbite React
import Image from 'next/image'; // Importação do componente de imagem otimizada do Next.js
import { HiTrash } from "react-icons/hi"; // Importação do ícone de lixeira

/**
 * Componente de galeria de imagens que permite visualizar, adicionar e remover imagens.
 * 
 * @param {string} label - Rótulo do campo de entrada
 * @param {string} name - Nome do campo para submissão de formulário
 * @param {string} id - ID único do campo
 * @param {Array} images - Lista de imagens atuais
 * @param {Function} onImagesChange - Função chamada ao adicionar ou alterar imagens
 * @param {Function} onImageRemove - Função chamada ao remover uma imagem
 * @param {boolean} disabled - Define se o campo está desabilitado
 * @param {boolean} required - Define se o campo é obrigatório
 * @param {boolean} multiple - Permite múltiplas seleções de arquivos
 * @param {number} maxImages - Número máximo de imagens permitidas
 * @param {string} helperText - Texto auxiliar exibido abaixo do campo
 * @param {string} className - Classes CSS adicionais
 */
export default function ImageGallery({ 
    label, // Rótulo do campo
    name, // Nome do campo para formulários
    id, // ID único para o campo
    images = [], // Lista de imagens atuais
    onImagesChange, // Callback para mudanças nas imagens
    onImageRemove, // Callback para remoção de imagens
    disabled = false, // Estado de desabilitado
    required = false, // Estado de obrigatório
    multiple = true, // Permite múltiplas seleções
    maxImages = 10, // Limite máximo de imagens
    helperText, // Texto auxiliar
    className = "" // Classes CSS adicionais
}) {
    // Função para lidar com mudanças nos arquivos selecionados
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // Converte FileList para array
        
        if (files.length + images.length > maxImages) {
            // Verifica se o número total de imagens excede o limite
            return;
        }
        
        const newImages = files.map(file => {
            const reader = new FileReader(); // Cria um leitor de arquivos
            return new Promise((resolve) => {
                reader.onloadend = () => {
                    resolve({
                        file, // Arquivo original
                        url: reader.result, // URL gerada pelo FileReader
                        id: Date.now() + Math.random(), // ID único temporário
                        isExisting: false // Indica que a imagem é nova
                    });
                };
                reader.readAsDataURL(file); // Lê o arquivo como URL
            });
        });
        
        Promise.all(newImages).then(resolvedImages => {
            onImagesChange([...images, ...resolvedImages]); // Atualiza a lista de imagens
        });
    };

    // Função para remover uma imagem da lista
    const handleImageRemove = (index) => {
        const imageToRemove = images[index]; // Obtém a imagem a ser removida
        const newImages = images.filter((_, i) => i !== index); // Filtra a lista de imagens
        
        onImagesChange(newImages); // Atualiza a lista de imagens
        
        // Chama o callback de remoção, se definido
        if (onImageRemove) {
            onImageRemove(imageToRemove, index);
        }
    };

    return (
        <div className={`py-2 w-full ${className}`}> {/* Container principal */}
            <Label 
                htmlFor={id} 
                value={label} 
            />
            <div className="flex-wrap flex justify-center items-center mb-2"> {/* Container das imagens */}
                {images.map((image, index) => (
                    <div key={image.id || index} className="relative"> {/* Cada imagem */}
                        <Image 
                            src={image.url} // URL da imagem
                            width={100} // Largura da imagem
                            height={100} // Altura da imagem
                            className="size-24 m-1 rounded-lg" // Estilos da imagem
                            alt={`Imagem ${index + 1}`} // Texto alternativo
                        />
                        <button
                            type="button"
                            onClick={() => handleImageRemove(index)} // Remove a imagem ao clicar
                            disabled={disabled} // Desabilita o botão se necessário
                            className="bg-cornflowerblue hover:bg-cornflowerblue/80 p-1 absolute right-1 bottom-1 disabled:opacity-50"
                        >
                            <HiTrash className="w-4 h-4"/> {/* Ícone de lixeira */}
                        </button>
                    </div>
                ))}
            </div>
            <FileInput
                required={required} // Define se o campo é obrigatório
                multiple={multiple} // Permite múltiplas seleções
                aria-disabled={disabled} // Atributo de acessibilidade
                name={name} // Nome do campo
                color="light" // Tema claro
                id={id} // ID único
                accept="image/*" // Aceita apenas arquivos de imagem
                onChange={handleFileChange} // Callback para mudanças nos arquivos
                helperText={helperText} // Texto auxiliar
            />
        </div>
    );
}
