import { useTheme } from "next-themes";
import { useMemo, useState } from "react";
import { type AxisOptions, Chart } from "react-charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/_components/ui/select";

enum ChartType {
  Line = "line",
  Area = "area",
  Bar = "bar",
  Bubble = "bubble",
}

type DailyCustomerData = {
  date: Date;
  amount: number;
};

type DailyCustomerDataSeries = {
  label: string;
  data: DailyCustomerData[];
};

export function ChartsTest() {
  const { theme } = useTheme();
  const [chartType, setChartType] = useState<ChartType>(ChartType.Line);

  const data: DailyCustomerDataSeries[] = useMemo(
    () => [
      {
        label: "Invoices Amount",
        data: [
          { date: new Date("2022-01-01"), amount: 100 },
          { date: new Date("2022-01-02"), amount: 200 },
          { date: new Date("2022-01-03"), amount: 300 },
          { date: new Date("2022-01-04"), amount: 400 },
          { date: new Date("2022-01-05"), amount: 500 },
          { date: new Date("2022-01-06"), amount: 600 },
          { date: new Date("2022-01-07"), amount: 700 },
          { date: new Date("2022-01-08"), amount: 20 },
          { date: new Date("2022-01-09"), amount: 900 },
          { date: new Date("2022-01-10"), amount: 200 },
        ],
      },
      // {
      //   label: "Total Amount",
      //   data: [
      //     { date: new Date("2022-01-01"), amount: 100 },
      //     { date: new Date("2022-01-02"), amount: 300 },
      //     { date: new Date("2022-01-03"), amount: 600 },
      //     { date: new Date("2022-01-04"), amount: 1000 },
      //     { date: new Date("2022-01-05"), amount: 1500 },
      //     { date: new Date("2022-01-06"), amount: 2100 },
      //     { date: new Date("2022-01-07"), amount: 2800 },
      //     { date: new Date("2022-01-08"), amount: 2820 },
      //     { date: new Date("2022-01-09"), amount: 3720 },
      //     { date: new Date("2022-01-10"), amount: 3920 },
      //   ],
      // },
    ],
    [],
  );

  const primaryAxis = useMemo(
    (): AxisOptions<DailyCustomerData> => ({
      getValue: (datum) => datum.date,
      scaleType: "localTime",
    }),
    [],
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<DailyCustomerData>[] => [
      {
        getValue: (datum) => datum.amount,
        tickCount: 5,
        elementType: chartType,
      },
    ],
    [chartType],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="w-[100px]">
        <Select
          value={chartType}
          onValueChange={(newValue: ChartType) => setChartType(newValue)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ChartType.Line}>Line</SelectItem>
            <SelectItem value={ChartType.Area}>Area</SelectItem>
            <SelectItem value={ChartType.Bar}>Bar</SelectItem>
            <SelectItem value={ChartType.Bubble}>Bubble</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[300px] w-full">
        <Chart
          options={{
            data,
            primaryAxis,
            getSeriesStyle: (series) => {
              if (series.label === "Invoices Amount") {
                return {
                  color: "hsl(142.1, 76.2%, 36.3%)",
                };
              }
              return {};
            },
            secondaryAxes,
            dark: theme === "dark",
          }}
        />
      </div>
    </div>
  );
}
