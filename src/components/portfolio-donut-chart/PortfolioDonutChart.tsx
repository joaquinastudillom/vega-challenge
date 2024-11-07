import { useCallback, useState } from 'react';

import { Asset, Portfolio } from '@/types';
import { Cell, Legend, Pie, PieChart } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

enum View {
    CLASS = 'class',
    ASSET = 'asset'
}

interface PortfolioDonutChartProps {
    portfolio: Portfolio;
    assets: Asset[];
}

export const PortfolioDonutChart = ({ portfolio, assets }: PortfolioDonutChartProps) => {
    const [viewType, setViewType] = useState(View.ASSET);

    const chartData = useCallback(() => {
        const dataMap = new Map<string, number>();

        portfolio.positions.forEach(position => {
            const asset = assets.find(asset => asset.id === position.asset);
            if (asset) {
                const key = viewType === View.ASSET ? asset.type : asset.name;
                const value = position.quantity * position.price;
                dataMap.set(key, (dataMap.get(key) || 0) + value);
            }
        });

        return Array.from(dataMap.entries()).map(([name, value]) => ({ name, value }));
    }, [portfolio.positions, assets, viewType]);

    const data = chartData();

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <RadioGroup
                    defaultValue={viewType}
                    onValueChange={type => setViewType(type as View)}
                >
                    <div className="absolute end-4 flex gap-2 capitalize">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={View.ASSET} id={View.ASSET} />
                            <Label htmlFor={View.ASSET}>{View.ASSET}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value={View.CLASS} id={View.CLASS} />
                            <Label htmlFor={View.CLASS}>{View.CLASS}</Label>
                        </div>
                    </div>
                </RadioGroup>
                <CardTitle>Portfolio Balance Donut Chart</CardTitle>
                <CardDescription>By {viewType}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={2}
                        >
                            {data.map((_, idx) => (
                                <Cell key={`cell-${idx}`} fill={`hsl(var(--chart-${idx}))`} />
                            ))}
                        </Pie>
                        <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
        </Card>
    );
};
