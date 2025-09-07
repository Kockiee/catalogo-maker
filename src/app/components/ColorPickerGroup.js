'use client'
import ColorPicker from "./ColorPicker";

export default function ColorPickerGroup({ 
    colors, 
    onColorChange, 
    disabled = false 
}) {
    const colorFields = [
        { key: 'primaryColor', label: 'Cor principal' },
        { key: 'secondaryColor', label: 'Cor secundária' },
        { key: 'tertiaryColor', label: 'Cor terciária' },
        { key: 'textColor', label: 'Cor dos textos' }
    ];

    return (
        <div>
            <div className="p-2 inline-flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Cores do catálogo</span>
            </div>
            {colorFields.map(({ key, label }) => (
                <ColorPicker
                    key={key}
                    label={label}
                    value={colors[key]}
                    onChange={(e) => onColorChange(key, e.target.value)}
                    name={key}
                    disabled={disabled}
                />
            ))}
        </div>
    );
}
