"use client";
import { useEffect, useRef } from "react";
import {
  SciChartSurface,
  NumericAxis,
  SciChartJsNavyTheme,
  EDataPointWidthMode,
  // EColumnDataLabelPosition,
  // EHorizontalTextPosition,
  // EVerticalTextPosition,
  EAxisAlignment,
  ENumericFormat,
  ICategoryAxisOptions,
  EAutoRange,
  MouseWheelZoomModifier,
  ZoomExtentsModifier,
  // CursorModifier,
  FastBoxPlotRenderableSeries,
  BoxPlotDataSeries,
  // XyScatterRenderableSeries,
  // XyDataSeries,
  CategoryAxis,
  FastRectangleRenderableSeries,
  XyxyDataSeries,
  EColumnMode,
  EColumnYMode,
  EResamplingMode,
} from "scichart";

// type MetadataType = {
//   label: string;
//   isSelected: boolean;
// };

// An example of WASM dependencies URLs configuration to fetch from origin server:
SciChartSurface.configure({
  wasmUrl: "scichart2d.wasm",
  dataUrl: "scichart2d.data",
});

const isVertical = true;
const isXCategoryAxis = false;

async function initSciChart(rootElement: string | HTMLDivElement) {
  // Initialize SciChartSurface. Don't forget to await!
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );

  const configCategoryAxis: ICategoryAxisOptions = {
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
    cursorLabelFormat: ENumericFormat.Decimal,
    cursorLabelPrecision: 0,
  };

  const configX = {
    axisAlignment: isVertical ? EAxisAlignment.Bottom : EAxisAlignment.Left,
    // growBy: new NumberRange(0.05, 0.05),
    // visibleRange: new NumberRange(-5, 65), TODO: fix auto range
    autoRange: EAutoRange.Once,
    flippedCoordinates: false,
  };

  sciChartSurface.xAxes.add(
    isXCategoryAxis
      ? new CategoryAxis(wasmContext, { ...configX, ...configCategoryAxis })
      : new NumericAxis(wasmContext, configX)
  );

  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisAlignment: isVertical ? EAxisAlignment.Left : EAxisAlignment.Bottom,
      // growBy: new NumberRange(0.05, 0.05),
      // visibleRange: new NumberRange(0, 60),
      autoRange: EAutoRange.Once,
      flippedCoordinates: !isVertical,
    })
  );

  const xValues = [4, 5, 6];
  const minimumValues = [0, 1, 0.5];
  const maximumValues = [10, 9, 9.5];
  const medianValues = [4.5, 5.5, 5];
  const lowerQuartileValues = [3, 4, 3.5];
  const upperQuartileValues = [7, 6, 6.5];

  // const lineDataSeries = new XyDataSeries(wasmContext, {
  //   xValues,
  //   yValues: medianValues,
  // });
  // const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
  //   dataSeries: lineDataSeries,
  // });
  // sciChartSurface.renderableSeries.add(scatterSeries);

  const boxPlotDataSeries = new BoxPlotDataSeries(wasmContext, {
    xValues, // TODO: add warning no xValues
    minimumValues,
    maximumValues,
    medianValues,
    lowerQuartileValues,
    upperQuartileValues,
  });

  
  const boxSeries = new FastBoxPlotRenderableSeries(wasmContext, {
    dataSeries: boxPlotDataSeries,
    stroke: "Black",
    // It would be nice to draw borders inside the box, to make the median line go from the left to the right edge without gaps on the edges
    strokeThickness: 2,
    // With EDataPointWidthMode.Range mode autoRange once does not respect dataPointWidth because on first render xCoordCalc.viewportDimension is 0
    // Absolute does work correctly on initial autorange because viewportDimension is undefined
    dataPointWidthMode: EDataPointWidthMode.Relative,
    dataPointWidth: 0.5,
    fill: "steelblue",
    opacity: 0.8,
    strokeDashArray: [5, 7], // support for the box does not work ???
    whiskers: {
      stroke: "darkred",
      strokeThickness: 2,
      strokeDashArray: [5, 5],
    },
    cap: {
      stroke: "yellow",
      strokeThickness: 2,
      dataPointWidth: 0.3,
    },
    medianLine: {
      stroke: "white",
      strokeThickness: 2,
    },
  });
  sciChartSurface.renderableSeries.add(boxSeries);

  // const columnSeries = new FastColumnRenderableSeries(wasmContext, {
  //   dataSeries: boxPlotDataSeries,
  //   dataPointWidthMode: EDataPointWidthMode.Range,
  //   dataPointWidth: 0.5,
  //   strokeThickness: 10,
  //   stroke: "green",
  // });
  // sciChartSurface.renderableSeries.add(columnSeries);

  // const errorBars = new FastErrorBarsRenderableSeries(wasmContext, {
  //   dataSeries: boxPlotDataSeries,
  //   dataPointWidthMode: EDataPointWidthMode.Relative,
  //   dataPointWidth: 0.25,
  // });
  // sciChartSurface.renderableSeries.add(errorBars);

  setTimeout(() => sciChartSurface.zoomExtents());

  sciChartSurface.chartModifiers.add(
    new MouseWheelZoomModifier(),
    new ZoomExtentsModifier()
    // new CursorModifier({ showTooltip: true })
  );

  const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
    dataSeries: new XyxyDataSeries(wasmContext, {
      xValues: xValues.map((d) => d - 0.2),
      yValues: lowerQuartileValues,
      x1Values: xValues.map((d) => d + 0.2),
      y1Values: upperQuartileValues,
    }),
    columnXMode: EColumnMode.StartEnd,
    columnYMode: EColumnYMode.TopBottom,
    dataPointWidth: 1,
    dataPointWidthMode: EDataPointWidthMode.Range,
    stroke: "black",
    strokeThickness: 2,
    fill: "steelblue",
    opacity: 0.5,
    resamplingMode: EResamplingMode.None,
    topCornerRadius: 2,
    bottomCornerRadius: 2,
  });

  sciChartSurface.renderableSeries.add(rectangleSeries);

  const topVertLinesSeries = new FastRectangleRenderableSeries(wasmContext, {
    dataSeries: new XyxyDataSeries(wasmContext, {
      xValues: xValues.map((d) => d - 0.005),
      yValues: upperQuartileValues,
      x1Values: xValues.map((d) => d + 0.005),
      y1Values: maximumValues,
    }),
    columnXMode: EColumnMode.StartEnd,
    columnYMode: EColumnYMode.TopBottom,
    dataPointWidth: 1,
    dataPointWidthMode: EDataPointWidthMode.Range,
    stroke: "black",
    strokeThickness: 2,
    fill: "steelblue",
    opacity: 0.5,
    resamplingMode: EResamplingMode.None,
    topCornerRadius: 2,
    bottomCornerRadius: 2,
  });

  sciChartSurface.renderableSeries.add(topVertLinesSeries);

  const bottomVertLinesSeries = new FastRectangleRenderableSeries(wasmContext, {
    dataSeries: new XyxyDataSeries(wasmContext, {
      xValues: xValues.map((d) => d - 0.005),
      yValues: minimumValues,
      x1Values: xValues.map((d) => d + 0.005),
      y1Values: lowerQuartileValues,
    }),
    columnXMode: EColumnMode.StartEnd,
    columnYMode: EColumnYMode.TopBottom,
    dataPointWidth: 1,
    dataPointWidthMode: EDataPointWidthMode.Range,
    stroke: "black",
    strokeThickness: 2,
    fill: "steelblue",
    opacity: 0.5,
    resamplingMode: EResamplingMode.None,
    topCornerRadius: 2,
    bottomCornerRadius: 2,
  });

  sciChartSurface.renderableSeries.add(bottomVertLinesSeries);

  const medianLinesSeries = new FastRectangleRenderableSeries(wasmContext, {
    dataSeries: new XyxyDataSeries(wasmContext, {
      xValues: xValues.map((d) => d - 0.2),
      yValues: medianValues.map((d) => d - 0.1),
      x1Values: xValues.map((d) => d + 0.2),
      y1Values: medianValues.map((d) => d + 0.1),
    }),
    columnXMode: EColumnMode.StartEnd,
    columnYMode: EColumnYMode.TopBottom,
    dataPointWidth: 1,
    dataPointWidthMode: EDataPointWidthMode.Range,
    stroke: "black",
    strokeThickness: 2,
    fill: "white",
    opacity: 0.5,
    resamplingMode: EResamplingMode.None,
    topCornerRadius: 2,
    bottomCornerRadius: 2,
  });

  sciChartSurface.renderableSeries.add(medianLinesSeries);

  const topLinesSeries = new FastRectangleRenderableSeries(wasmContext, {
    dataSeries: new XyxyDataSeries(wasmContext, {
      xValues: xValues.map((d) => d - 0.15),
      yValues: maximumValues.map((d) => d - 0.1),
      x1Values: xValues.map((d) => d + 0.15),
      y1Values: maximumValues.map((d) => d + 0.1),
    }),
    columnXMode: EColumnMode.StartEnd,
    columnYMode: EColumnYMode.TopBottom,
    dataPointWidth: 1,
    dataPointWidthMode: EDataPointWidthMode.Range,
    stroke: "black",
    strokeThickness: 2,
    fill: "steelblue",
    opacity: 0.5,
    resamplingMode: EResamplingMode.None,
    topCornerRadius: 2,
    bottomCornerRadius: 2,
  });

  sciChartSurface.renderableSeries.add(topLinesSeries);

  const bottomLinesSeries = new FastRectangleRenderableSeries(wasmContext, {
    dataSeries: new XyxyDataSeries(wasmContext, {
      xValues: xValues.map((d) => d - 0.15),
      yValues: minimumValues.map((d) => d - 0.1),
      x1Values: xValues.map((d) => d + 0.15),
      y1Values: minimumValues.map((d) => d + 0.1),
    }),
    columnXMode: EColumnMode.StartEnd,
    columnYMode: EColumnYMode.TopBottom,
    dataPointWidth: 1,
    dataPointWidthMode: EDataPointWidthMode.Range,
    stroke: "black",
    strokeThickness: 2,
    fill: "steelblue",
    opacity: 0.5,
    resamplingMode: EResamplingMode.None,
    topCornerRadius: 2,
    bottomCornerRadius: 2,
  });

  sciChartSurface.renderableSeries.add(bottomLinesSeries);

  return { sciChartSurface };
}

export default function Home() {
  const rootElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initPromise = initSciChart(rootElementRef.current as HTMLDivElement);

    return () => {
      initPromise.then(({ sciChartSurface }) => sciChartSurface.delete());
    };
  }, []);

  return <div ref={rootElementRef} style={{ width: 900, height: 600 }}></div>;
}
