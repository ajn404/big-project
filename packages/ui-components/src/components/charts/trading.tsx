import React, { useEffect, useRef } from 'react';
import { createAutoRegisterComponent, CATEGORIES } from '../../auto-register';
import { AreaSeries, createChart, ColorType } from 'lightweight-charts';

// 定义 ChartComponent 的 props 接口
interface ChartComponentProps {
    data: { time: string; value: number }[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}

// 定义 LightweightChart 的 props 接口
interface LightweightChartProps {
    children?: React.ReactNode;
    colors?: ChartComponentProps['colors'];
}

// 图表组件 - 使用 React.FC 并提供明确的 props 类型
export const ChartComponent: React.FC<ChartComponentProps> = ({ data, colors = {} }) => {
    const {
        backgroundColor = 'white',
        lineColor = '#2962FF',
        textColor = 'black',
        areaTopColor = '#2962FF',
        areaBottomColor = 'rgba(41, 98, 255, 0.28)',
    } = colors;

    // 正确类型化 useRef 并初始化为 null
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 添加空值检查
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        // 现在 current 保证不为 null
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: backgroundColor },
                textColor,
            },
            width: chartContainerRef.current.clientWidth,
            height: 300,
        });
        chart.timeScale().fitContent();

        const newSeries = chart.addSeries(AreaSeries, {
            lineColor,
            topColor: areaTopColor,
            bottomColor: areaBottomColor
        });
        newSeries.setData(data);

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor]);

    return <div ref={chartContainerRef} />;
};

const initialData = [
    { time: '2018-12-22', value: 32.51 },
    { time: '2018-12-23', value: 31.11 },
    { time: '2018-12-24', value: 27.02 },
    { time: '2018-12-25', value: 27.32 },
    { time: '2018-12-26', value: 25.17 },
    { time: '2018-12-27', value: 28.89 },
    { time: '2018-12-28', value: 25.46 },
    { time: '2018-12-29', value: 23.92 },
    { time: '2018-12-30', value: 22.68 },
    { time: '2018-12-31', value: 22.67 },
];

// 包装组件 - 提供明确的 props 类型
function LightweightChart({ children, colors }: LightweightChartProps) {
    return <ChartComponent data={initialData} colors={colors} />;
}

// 自动注册组件
const RegisteredLightweightChart = createAutoRegisterComponent({
    id: 'LightweightChartLightweightChart',
    name: 'LightweightChart',
    description: 'Component description',
    category: CATEGORIES.UI,
    template: `:::react{component="LightweightChart"}Content here:::`,
    tags: ['ui', 'component'],
    version: '1.0.0',
})(LightweightChart);

export { RegisteredLightweightChart as LightweightChart };