import React from 'react';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';

const FormField = ({
    label,
    id,
    type = 'text',
    options = [], // For select type
    isTextArea = false,
    className = '',
    labelClassName = '',
    inputClassName = '',
    ...props
}) => {
    const renderInput = () => {
        if (isTextArea) {
            return (
                <textarea
                    id={id}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${inputClassName}`}
                    rows={3}
                    {...props}
                />
            );
        } else if (type === 'select') {
            return (
                <select
                    id={id}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none ${inputClassName}`}
                    {...props}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        } else {
            return (
                <Input
                    id={id}
                    type={type}
                    className={inputClassName}
                    {...props}
                />
            );
        }
    };

    return (
        <div className={className}>
            <Label htmlFor={id} className={labelClassName}>
                {label}
            </Label>
            {renderInput()}
        </div>
    );
};

export default FormField;