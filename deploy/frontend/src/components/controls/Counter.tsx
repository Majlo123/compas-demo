import React from 'react';
import { Button } from './Button';

interface CounterProps {
    value: number;
    onIncrement: () => void;
    onDecrement: () => void;
    min?: number;
    max?: number;
    className?: string;
}

export const Counter: React.FC<CounterProps> = ({
    value,
    onIncrement,
    onDecrement,
    min,
    max,
    className,
}) => {
    return (
        <div className={`flex items-center justify-between border border-gray-200 rounded-lg p-1.5 w-fit gap-4 bg-white ${className || ''}`}>
            <Button
                variant="small"
                icon="minus"
                onClick={onDecrement}
                disabled={min !== undefined && value <= min}
                aria-label="Decrease value"
            />
            <span className="text-p1 font-bold text-secondary min-w-[24px] text-center">
                {value}
            </span>
            <Button
                variant="small"
                icon="plus"
                onClick={onIncrement}
                disabled={max !== undefined && value >= max}
                aria-label="Increase value"
            />
        </div>
    );
};
