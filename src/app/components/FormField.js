'use client'
import { Label, TextInput, Textarea } from "flowbite-react";

export default function FormField({ 
    type = "text",
    label,
    name,
    id,
    value,
    onChange,
    placeholder,
    required = false,
    disabled = false,
    maxLength,
    rows,
    className = "",
    shadow = true
}) {
    const commonProps = {
        value,
        onChange,
        color: "light",
        name,
        id,
        placeholder,
        required,
        "aria-disabled": disabled,
        className: type === "textarea" ? 'focus:ring-jordyblue focus:border-none focus:ring-2' : className
    };

    if (shadow && type !== "textarea") {
        commonProps.shadow = true;
    }

    if (maxLength) {
        commonProps.maxLength = maxLength;
    }

    if (rows && type === "textarea") {
        commonProps.rows = rows;
    }

    return (
        <div className="py-2 w-full">
            <Label 
                htmlFor={id} 
                value={label} 
            />
            {type === "textarea" ? (
                <Textarea {...commonProps} />
            ) : (
                <TextInput 
                    {...commonProps}
                    type={type}
                />
            )}
        </div>
    );
}
