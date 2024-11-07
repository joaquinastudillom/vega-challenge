import { PortfolioDonutChart } from '@/components/portfolio-donut-chart';
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

export const Home = () => {
    return (
        <Tabs defaultValue="donut" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="donut">Donut Chart</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
            <TabsContent value="donut">
                <PortfolioDonutChart portfolio={portfolio} assets={assets} />
            </TabsContent>
            <TabsContent value="table">Table</TabsContent>
        </Tabs>
    );
};
