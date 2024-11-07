import { PortfolioViewPropsType } from '@/types';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';

export const PortfolioTable = ({ data, view }: PortfolioViewPropsType) => {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Positions Table</CardTitle>
                <CardDescription>By {view}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Value</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
        </Card>
    );
};
