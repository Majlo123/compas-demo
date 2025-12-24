import type { Meta, StoryObj } from '@storybook/react';
import { Label, CommodityCategory } from './Label';

const meta = {
    title: 'Controls/Label',
    component: Label,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        category: {
            control: 'select',
            options: [
                "ALCOHOLIC BEVERAGE",
                "BREAD PRODUCTS",
                "CLEANING MATERIALS",
                "COLD BEVERAGES",
                "CONFECTIONERY",
                "CRISPS AND SNACKS",
                "DAIRY AND CHEESE",
                "DISPOSABLES",
                "FISH AND SEAFOOD",
                "FRUIT AND VEGETABLES",
                "GROCERIES AMBIENT",
                "HOT BEVERAGES",
                "Ice Cubes",
                "MEAT",
                "NON FOOD RETAIL",
                "SANDWICHES",
                "SAVOURY PRODUCTS",
                "SWEET PRODUCTS",
            ],
        },
    },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        category: 'FRUIT AND VEGETABLES',
    },
};

export const AllCategories: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4 max-w-2xl">
            {[
                "ALCOHOLIC BEVERAGE",
                "BREAD PRODUCTS",
                "CLEANING MATERIALS",
                "COLD BEVERAGES",
                "CONFECTIONERY",
                "CRISPS AND SNACKS",
                "DAIRY AND CHEESE",
                "DISPOSABLES",
                "FISH AND SEAFOOD",
                "FRUIT AND VEGETABLES",
                "GROCERIES AMBIENT",
                "HOT BEVERAGES",
                "Ice Cubes",
                "MEAT",
                "NON FOOD RETAIL",
                "SANDWICHES",
                "SAVOURY PRODUCTS",
                "SWEET PRODUCTS",
            ].map((category) => (
                <Label key={category} category={category} />
            ))}
        </div>
    ),
};
