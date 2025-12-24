import React from 'react';
import { twMerge } from 'tailwind-merge';

export type CommodityCategory =
    | "ALCOHOLIC BEVERAGE"
    | "BREAD PRODUCTS"
    | "CLEANING MATERIALS"
    | "COLD BEVERAGES"
    | "CONFECTIONERY"
    | "CRISPS AND SNACKS"
    | "DAIRY AND CHEESE"
    | "DISPOSABLES"
    | "FISH AND SEAFOOD"
    | "FRUIT AND VEGETABLES"
    | "GROCERIES AMBIENT"
    | "HOT BEVERAGES"
    | "Ice Cubes"
    | "MEAT"
    | "NON FOOD RETAIL"
    | "SANDWICHES"
    | "SAVOURY PRODUCTS"
    | "SWEET PRODUCTS";

const categoryStyles: Record<string, string> = {
    "ALCOHOLIC BEVERAGE": "text-category-alcoholic",
    "BREAD PRODUCTS": "text-category-bread",
    "CLEANING MATERIALS": "text-category-cleaning",
    "COLD BEVERAGES": "text-category-coldBeverages",
    "CONFECTIONERY": "text-category-confectionery",
    "CRISPS AND SNACKS": "text-category-crisps",
    "DAIRY AND CHEESE": "text-category-dairy",
    "DISPOSABLES": "text-category-disposables",
    "FISH AND SEAFOOD": "text-category-fish",
    "FRUIT AND VEGETABLES": "text-category-fruitVeg",
    "GROCERIES AMBIENT": "text-category-groceries",
    "HOT BEVERAGES": "text-category-hotBeverages",
    "Ice Cubes": "text-category-ice",
    "MEAT": "text-category-meat",
    "NON FOOD RETAIL": "text-category-nonfood",
    "SANDWICHES": "text-category-sandwiches",
    "SAVOURY PRODUCTS": "text-category-savoury",
    "SWEET PRODUCTS": "text-category-sweets",
};

interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
    category: string;
    className?: string;
}

export const Label: React.FC<LabelProps> = ({ category, className, ...props }) => {
    const styles = categoryStyles[category] || 'text-secondary';

    return (
        <span
            className={twMerge(
                'inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold uppercase bg-surface',
                styles,
                className
            )}
            {...props}
        >
            {category}
        </span>
    );
};
