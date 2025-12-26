import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table';
import { ParLevel } from '@/types/parLevel.types';
import React from 'react';
import { StatusLabel } from './controls/StatusLabel';
import { Counter } from './controls/Counter';
import { Label } from './controls/Label';
import { CopyIcon } from 'lucide-react';

interface ParLevelsTableProps {
    parLevels: ParLevel[];
}

export const ParLevelsTable: React.FC<ParLevelsTableProps> = ({ parLevels }) => {
    return (
        <div className="relative w-full h-full">
            <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                        <TableHead>PRODUCT</TableHead>
                        <TableHead>COMMODITY GROUP</TableHead>
                        <TableHead>STOCK LEVEL</TableHead>
                        <TableHead>THRESHOLD</TableHead>
                        <TableHead className="w-32">STATUS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {parLevels.map((level) => (
                        <TableRow key={level.product_id}>
                            <TableCell className="font-medium">
                                <div className="flex gap-2 flex-col">
                                    <p className="text-p2 m-0 font-bold">{level.product_name}</p>
                                    <div className="flex gap-1">
                                        <p className="text-p2 m-0">{level.product_id}</p>
                                        <button className="p-0"><CopyIcon size={12} /></button>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Label category={level.comodity_group}>{level.comodity_group}</Label>
                            </TableCell>
                            <TableCell>{level.stockLevel}</TableCell>
                            <TableCell><Counter value={level.threshhold} onIncrement={() => { }} onDecrement={() => { }} /> </TableCell>
                            <TableCell>
                                <StatusLabel status={level.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
