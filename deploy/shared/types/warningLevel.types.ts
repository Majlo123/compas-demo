export type WarningLevel = {
    id?: string;
    name: string;
    description?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
};

export type CreateWarningLevel = Omit<WarningLevel, 'id' | 'createdAt' | 'updatedAt'>;
