'use client'
import { Label, FileInput } from "flowbite-react";

export default function ImageUpload({ 
    label,
    name,
    id,
    onChange,
    disabled = false,
    required = false,
    accept = "image/*",
    helperText,
    multiple = false
}) {
    return (
        <div className="py-2 w-full">
            <Label 
                htmlFor={id} 
                value={label} 
            />
            <FileInput
                aria-disabled={disabled}
                name={name}
                color="light"
                id={id}
                accept={accept}
                onChange={onChange}
                helperText={helperText}
                required={required}
                multiple={multiple}
            />
        </div>
    );
}
