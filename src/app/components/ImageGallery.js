'use client'
import { Label, FileInput } from "flowbite-react";
import Image from 'next/image';
import { HiTrash } from "react-icons/hi";

export default function ImageGallery({ 
    label,
    name,
    id,
    images = [],
    onImagesChange,
    onImageRemove,
    disabled = false,
    required = false,
    multiple = true,
    maxImages = 10,
    helperText,
    className = ""
}) {
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length + images.length > maxImages) {
            // Você pode passar um callback de erro aqui se necessário
            return;
        }
        
        const newImages = files.map(file => {
            const reader = new FileReader();
            return new Promise((resolve) => {
                reader.onloadend = () => {
                    resolve({
                        file,
                        url: reader.result,
                        id: Date.now() + Math.random(), // ID único temporário
                        isExisting: false
                    });
                };
                reader.readAsDataURL(file);
            });
        });
        
        Promise.all(newImages).then(resolvedImages => {
            onImagesChange([...images, ...resolvedImages]);
        });
    };

    const handleImageRemove = (index) => {
        const imageToRemove = images[index];
        const newImages = images.filter((_, i) => i !== index);
        
        onImagesChange(newImages);
        
        // Se há callback para remoção (útil para EditProduct)
        if (onImageRemove) {
            onImageRemove(imageToRemove, index);
        }
    };

    return (
        <div className={`py-2 w-full ${className}`}>
            <Label 
                htmlFor={id} 
                value={label} 
            />
            <div className="flex-wrap flex justify-center items-center mb-2">
                {images.map((image, index) => (
                    <div key={image.id || index} className="relative">
                        <Image 
                            src={image.url} 
                            width={100} 
                            height={100} 
                            className="size-24 m-1 rounded-lg"
                            alt={`Imagem ${index + 1}`}
                        />
                        <button
                            type="button"
                            onClick={() => handleImageRemove(index)}
                            disabled={disabled}
                            className="bg-cornflowerblue hover:bg-cornflowerblue/80 p-1 absolute right-1 bottom-1 disabled:opacity-50"
                        >
                            <HiTrash className="w-4 h-4"/>
                        </button>
                    </div>
                ))}
            </div>
            <FileInput
                required={required}
                multiple={multiple}
                aria-disabled={disabled}
                name={name}
                color="light"
                id={id}
                accept="image/*"
                onChange={handleFileChange}
                helperText={helperText}
            />
        </div>
    );
}
