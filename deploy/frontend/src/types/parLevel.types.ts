import { CommodityCategory } from "@/components/controls/Label";


export type ParLevel = {
    product_name: string;
    product_id: number;
    comodity_group: CommodityCategory;
    stockLevel: number;
    threshhold: number;
    status: 'OK' | 'TRIGGERED';
};
