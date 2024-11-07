import { PortfolioViewPropsType } from '@/types';
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

export const PortfolioDonutChart = ({ data, view }: PortfolioViewPropsType) => {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>Portfolio Balance Donut Chart</CardTitle>
                <CardDescription>By {view}</CardDescription>
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
