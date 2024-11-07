import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Asset, Portfolio, Price } from '@/types';
import axios from 'axios';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { PortfolioDonutChart } from '@/components/portfolio-donut-chart';
import { PortfolioHistoricalChart } from '@/components/portfolio-historical-chart';
import { PortfolioTable } from '@/components/portfolio-table';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

enum View {
    CLASS = 'class',
    ASSET = 'asset'
}

export const Home = () => {
    const [prices, setPrices] = useState<Price[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [portfolioData, setPorfolioData] = useState<Portfolio>({
        id: '',
        asOf: '',
        positions: []
    });
    const [portfolioHistoricalData, setPortfolioHistoricalData] = useState<Portfolio[]>([]);
    const [viewType, setViewType] = useState(View.ASSET);
    const [date, setDate] = useState<Date | undefined>(new Date());

    const fetchAssets = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/assets');
            setAssets(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPortfolioData = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/portfolios');
            setPorfolioData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPortfolioHistoricalData = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/portfolio');
            setPortfolioHistoricalData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchPrices = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/prices');
            setPrices(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchAssets();
        fetchPortfolioData();
        fetchPortfolioHistoricalData();
        fetchPrices();
    }, []);

    const chartData = useCallback(() => {
        const dataMap = new Map<string, number>();

        portfolioData.positions.forEach(position => {
            const asset = assets.find(asset => asset.id === position.asset);
            if (asset) {
                const key = viewType === View.ASSET ? asset.type : asset.name;
                const value = position.quantity * position.price;
                dataMap.set(key, (dataMap.get(key) || 0) + value);
            }
        });

        return Array.from(dataMap.entries()).map(([name, value]) => ({ name, value }));
    }, [portfolioData.positions, assets, viewType]);

    const portfolioHistoricalGraphData = portfolioHistoricalData.map((entry: any) => ({
        date: entry.asOf,
        total: entry.positions.reduce((sum: number, position: any) => {
            return sum + position.quantity * position.price;
        }, 0)
    }));

    const data = chartData();

    return (
        <div>
            <h2 className="font-semibold tracking-tight text-white text-3xl mb-3">Historical</h2>

            <div className=" mb-6">
                <PortfolioHistoricalChart data={portfolioHistoricalGraphData} />
            </div>

            <div>
                <h2 className="font-semibold tracking-tight text-white text-3xl mb-3">
                    Current Price
                </h2>

                <Card className="flex flex-col mb-6">
                    <CardContent className="flex-1 pb-0">
                        <dl className="flex gap-3 pt-4">
                            {prices.map(price => (
                                <div key={price.id}>
                                    <dt className="text-base/7">{price.asset}</dt>
                                    <dd className="order-first text-3xl font-semibold tracking-tight text-xl">
                                        {price.price}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
                </Card>
            </div>

            <h2 className="font-semibold tracking-tight text-white text-3xl mb-3">Graphs</h2>
            <div className="flex gap-4 mb-4">
                <RadioGroup
                    defaultValue={viewType}
                    onValueChange={type => setViewType(type as View)}
                >
                    <div className="flex gap-2 capitalize bg-white p-2 w-fit rounded-lg">
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

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={'outline'}
                            className={cn(
                                'w-[240px] justify-start text-left font-normal',
                                !date && 'text-muted-foreground'
                            )}
                        >
                            <CalendarIcon />
                            {date ? format(date, 'PPP') : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>

            <Tabs defaultValue="donut">
                <TabsList>
                    <TabsTrigger value="donut">Donut Chart</TabsTrigger>
                    <TabsTrigger value="table">Table</TabsTrigger>
                </TabsList>
                <TabsContent value="donut">
                    <PortfolioDonutChart view={viewType} data={data} />
                </TabsContent>
                <TabsContent value="table">
                    <PortfolioTable view={viewType} data={data} />
                </TabsContent>
            </Tabs>
        </div>
    );
};
