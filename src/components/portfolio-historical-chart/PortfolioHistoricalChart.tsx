import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface PortfolioHistoricalChartProps {
    data: any[];
}

export const PortfolioHistoricalChart = ({ data }: PortfolioHistoricalChartProps) => {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Portfolio Balance Donut Chart</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer config={{}} className="mx-auto aspect-square max-h-[250px]">
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Line
                            dataKey="total"
                            type="natural"
                            stroke="hsl(var(--chart-1))"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
        </Card>
    );
};
