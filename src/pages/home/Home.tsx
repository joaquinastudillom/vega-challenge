import { useCallback, useState } from 'react';

import { PortfolioDonutChart } from '@/components/portfolio-donut-chart';
import { PortfolioTable } from '@/components/portfolio-table';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const assets = [
    { id: '1', name: 'APPL', type: 'stock' },
    { id: '2', name: 'BTC', type: 'crypto' },
    { id: '3', name: 'ETH', type: 'crypto' },
    { id: '4', name: 'USD', type: 'fiat' }
];

const portfolio = {
    id: '123',
    asOf: '2023-01-01T00:00:00Z',
    positions: [
        { id: 1, asset: '1', quantity: 10, asOf: '2023-01-01T00:00:00Z', price: 150 },
        { id: 2, asset: '2', quantity: 0.5, asOf: '2023-01-01T00:00:00Z', price: 30000 },
        { id: 3, asset: '3', quantity: 1.2, asOf: '2023-01-01T00:00:00Z', price: 2000 },
        { id: 4, asset: '4', quantity: 1000, asOf: '2023-01-01T00:00:00Z', price: 1 }
    ]
};

enum View {
    CLASS = 'class',
    ASSET = 'asset'
}

export const Home = () => {
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
        <>
            <RadioGroup defaultValue={viewType} onValueChange={type => setViewType(type as View)}>
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

            <Tabs defaultValue="donut" className="w-[400px]">
                <TabsList>
                    <TabsTrigger value="donut">Donut Chart</TabsTrigger>
                    <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
                <TabsContent value="donut">
                    <PortfolioDonutChart view={viewType} data={data} />
                </TabsContent>
                <TabsContent value="table">
                    <PortfolioTable />
                </TabsContent>
            </Tabs>
        </>
    );
};
