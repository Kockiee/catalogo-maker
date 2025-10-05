/**
 * GRUPO DE SELETORES DE COR
 * 
 * Este arquivo contém um componente que agrupa múltiplos seletores de cor
 * para personalização do catálogo. Ele organiza os seletores de cor principal,
 * secundária, terciária e de texto em uma interface limpa e organizada.
 * 
 * Funcionalidades:
 * - Múltiplos seletores de cor organizados
 * - Labels descritivos para cada cor
 * - Estado desabilitado para todo o grupo
 * - Callback para mudanças de cor
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import ColorPicker from "./ColorPicker"; // Importa o componente ColorPicker

export default function ColorPickerGroup({ 
    colors, // Objeto com as cores atuais
    onColorChange, // Função chamada quando uma cor muda
    disabled = false // Se todo o grupo está desabilitado
}) {
    // Array com as configurações dos campos de cor
    const colorFields = [
        { key: 'primaryColor', label: 'Cor principal' }, // Cor principal do catálogo
        { key: 'secondaryColor', label: 'Cor secundária' }, // Cor secundária do catálogo
        { key: 'tertiaryColor', label: 'Cor terciária' }, // Cor terciária do catálogo
        { key: 'textColor', label: 'Cor dos textos' } // Cor dos textos
    ];

    return (
        <div>
            {/* Título do grupo de cores */}
            <div className="p-2 inline-flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Cores do catálogo</span>
            </div>
            {/* Mapeia e renderiza cada seletor de cor */}
            {colorFields.map(({ key, label }) => (
                <ColorPicker
                    key={key} // Chave única para cada seletor
                    label={label} // Label descritivo
                    value={colors[key]} // Valor atual da cor
                    onChange={(e) => onColorChange(key, e.target.value)} // Função que chama o callback com a chave e novo valor
                    name={key} // Nome do input
                    disabled={disabled} // Estado desabilitado
                />
            ))}
        </div>
    );
}
