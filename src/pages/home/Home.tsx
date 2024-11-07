import { useCallback, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Asset, Portfolio, Price } from '@/types';
import axios from 'axios';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { AlertCircle } from 'lucide-react';

import { PortfolioDonutChart } from '@/components/portfolio-donut-chart';
import { PortfolioHistoricalChart } from '@/components/portfolio-historical-chart';
import { PortfolioTable } from '@/components/portfolio-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

enum View {
    CLASS = 'class',
    ASSET = 'asset'
}

const delay = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms));

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
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isAppError, setIsAppError] = useState(false);

    const fetchInitialData = async () => {
        try {
            const [
                { data: assetsData },
                { data: portfolioData },
                { data: portfolioHistoricalData },
                { data: prices }
            ] = await Promise.all([
                axios.get('http://localhost:3001/assets'),
                axios.get('http://localhost:3001/portfolios'),
                axios.get('http://localhost:3001/portfolio'),
                delay(1000).then(() => axios.get('http://localhost:3001/prices'))
            ]);

            setAssets(assetsData);
            setPorfolioData(portfolioData);
            setPortfolioHistoricalData(portfolioHistoricalData);
            setPrices(prices);
        } catch (e) {
            setIsAppError(true);
        } finally {
            setIsAppLoading(false);
        }
    };

    useEffect(() => {
        fetchInitialData();
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

    if (isAppError) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Something went wrong please reload the page</AlertDescription>
            </Alert>
        );
    }

    return isAppLoading ? (
        <>
            <div className="flex flex-col space-y-3 mb-3">
                <Skeleton className="h-[50px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 h-[350px]" />
                </div>
            </div>
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[50px] w-[250px] rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 h-[150px]" />
                </div>
            </div>
        </>
    ) : (
        <div>
            <h2 className="font-semibold tracking-tight text-3xl mb-3">Historical</h2>

            <div className=" mb-6">
                <PortfolioHistoricalChart data={portfolioHistoricalGraphData} />
            </div>

            <div>
                <h2 className="font-semibold tracking-tight text-3xl mb-3">Current Price</h2>

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

            <h2 className="font-semibold tracking-tight text-3xl mb-3">Graphs</h2>
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
