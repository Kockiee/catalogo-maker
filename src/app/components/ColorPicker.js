'use client'
import { Label } from "flowbite-react";

export default function ColorPicker({ 
    label, 
    value, 
    onChange, 
    name, 
    disabled = false,
    className = ""
}) {
    return (
        <div className={`p-2 inline-flex items-center space-x-2 ${className}`}>
            <Label 
                htmlFor={name} 
                value={label} 
            />
            <input 
                value={value} 
                aria-disabled={disabled} 
                name={name} 
                className="bg-gray-100 border rounded p-0 w-12 h-8 cursor-pointer" 
                type="color" 
                onChange={onChange}
            />
        </div>
    );
}
