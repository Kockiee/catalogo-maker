'use client' // Diretiva para indicar que este código executa no cliente
import ColorPicker from "./ColorPicker"; // Importação do componente ColorPicker

/**
 * Componente que agrupa seletores de cores para configuração do catálogo
 * 
 * @param {Object} colors - Objeto contendo as cores atuais (primaryColor, secondaryColor, tertiaryColor, textColor)
 * @param {Function} onColorChange - Função chamada quando uma cor é alterada
 * @param {boolean} disabled - Define se os seletores estão desabilitados
 */
export default function ColorPickerGroup({ 
    colors, // Objeto com as cores atuais
    onColorChange, // Função de callback para mudanças de cor
    disabled = false // Estado de desabilitado dos seletores
}) {
    // Array com definições dos campos de cores
    const colorFields = [
        { key: 'primaryColor', label: 'Cor principal' }, // Cor de fundo principal
        { key: 'secondaryColor', label: 'Cor secundária' }, // Cor para cabeçalhos e rodapés
        { key: 'tertiaryColor', label: 'Cor terciária' }, // Cor para detalhes e bordas
        { key: 'textColor', label: 'Cor dos textos' } // Cor para textos
    ];

    return (
        <div> {/* Container principal */}
            <div className="p-2 inline-flex items-center space-x-2"> {/* Título do grupo */}
                <span className="text-sm font-medium text-gray-700">Cores do catálogo</span>
            </div>
            {/* Mapeia o array de campos de cores para renderizar um ColorPicker para cada cor */}
            {colorFields.map(({ key, label }) => (
                <ColorPicker
                    key={key} // Chave única para React
                    label={label} // Rótulo do seletor
                    value={colors[key]} // Valor atual da cor
                    onChange={(e) => onColorChange(key, e.target.value)} // Manipulador de evento que passa a chave e o novo valor
                    name={key} // Nome do campo
                    disabled={disabled} // Estado de desabilitado
                />
            ))}
        </div>
    );
}
