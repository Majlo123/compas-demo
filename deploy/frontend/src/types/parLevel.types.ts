import { CommodityCategory } from "@/components/controls/Label";

// API response type
export type ParLevelDTO = {
    prod_id: string;
    treshold: number;
    warning_level_id: string;
    created_at?: Date;
    updated_at?: Date;
    product_description?: string;
    commodity_group?: string;
    commodity_group_id?: string;
    quantity?: number;
};

// Frontend display type
export type ParLevel = {
    product_name: string;
    product_id: string;
    comodity_group: CommodityCategory;
    stockLevel: number;
    threshhold: number;
    status: 'OK' | 'TRIGGERED';
};

// Mapper function from API to frontend
export const mapParLevelDTOToParLevel = (dto: ParLevelDTO): ParLevel => {
    const stockLevel = dto.quantity || 0;
    const threshold = dto.treshold || 0;
    const status = stockLevel < threshold ? 'TRIGGERED' : 'OK';

    return {
        product_name: dto.product_description || `Product ${dto.prod_id}`,
        product_id: dto.prod_id,
        comodity_group: (dto.commodity_group as CommodityCategory) || 'OTHERS',
        stockLevel,
        threshhold: threshold,
        status,
    };
};
