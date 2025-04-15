import {
  BoxPlotDataSeries,
  CategoryAxis,
  EAutoRange,
  EAxisAlignment,
  EDataPointWidthMode,
  ENumericFormat,
  FastBoxPlotRenderableSeries,
  ICategoryAxisOptions,
  LabelProviderBase2D,
  NumberRange,
  NumericAxis,
  SciChartSurface,
} from "scichart";

function getGaussianRandom(mean: number, stdDev: number): number {
  const u1 = Math.random(); // these are uniform(0,1) random doubles
  const u2 = Math.random();
  // random normal(0,1)
  const randStdNormal =
    Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
  // random normal(mean, stddev^2)
  return Math.abs(mean + stdDev * randStdNormal);
}

console.log("getGaussianRandom", getGaussianRandom(0, 2));

class CustomLabelProvider extends LabelProviderBase2D {
  type!: string;
  onBeginAxisDraw(): void {}

  get formatLabel() {
    return (dataValue: number) => {
      if (dataValue === 4.5 || dataValue === 5.5) return "";

      if (dataValue === 4) return "P1";
      if (dataValue === 5) return "P2";
      if (dataValue === 6) return "P3";
      return dataValue.toFixed(1);
    };
  }
}

import { appTheme } from "./theme";

export const boxplotInitializationFunction1 = async (
  rootElement: string | HTMLDivElement
): Promise<{ sciChartSurface: SciChartSurface }> => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: appTheme.SciChartJsTheme,
    }
  );

  const isVertical = true;
  const isXCategoryAxis = false;

  const configCategoryAxis: ICategoryAxisOptions = {
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
    cursorLabelFormat: ENumericFormat.Decimal,
    cursorLabelPrecision: 0,
  };

  const configX = {
    labelProvider: new CustomLabelProvider(),
    axisAlignment: isVertical ? EAxisAlignment.Bottom : EAxisAlignment.Left,
    growBy: new NumberRange(0.05, 0.05),
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
      growBy: new NumberRange(0.05, 0.05),
      //   visibleRange: new NumberRange(0, 60),
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

  const boxPlotDataSeries = new BoxPlotDataSeries(wasmContext, {
    xValues,
    minimumValues,
    maximumValues,
    medianValues,
    lowerQuartileValues,
    upperQuartileValues,
  });

  const boxSeries = new FastBoxPlotRenderableSeries(wasmContext, {
    dataSeries: boxPlotDataSeries,
    stroke: appTheme.DarkIndigo,
    strokeThickness: 1,
    dataPointWidthMode: EDataPointWidthMode.Relative,
    dataPointWidth: 0.5,
    fill: appTheme.VividBlue,
    opacity: 0.8,
    // strokeDashArray: [5, 7], // support for the box does not work ???
    whiskers: {
      stroke: appTheme.VividRed,
      strokeThickness: 2,
      strokeDashArray: [5, 5],
    },
    cap: {
      stroke: appTheme.VividOrange,
      strokeThickness: 2,
      dataPointWidth: 0.3,
    },
    medianLine: {
      stroke: appTheme.White,
      strokeThickness: 2,
    },
  });
  sciChartSurface.renderableSeries.add(boxSeries);

  return { sciChartSurface };
};

export const boxplotInitializationFunction2 = async (
  rootElement: string | HTMLDivElement
): Promise<{ sciChartSurface: SciChartSurface }> => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: appTheme.SciChartJsTheme,
    }
  );

  const isVertical = false;
  const isXCategoryAxis = false;

  const configCategoryAxis: ICategoryAxisOptions = {
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
    cursorLabelFormat: ENumericFormat.Decimal,
    cursorLabelPrecision: 0,
  };

  const configX = {
    labelProvider: new CustomLabelProvider(),
    axisAlignment: isVertical ? EAxisAlignment.Bottom : EAxisAlignment.Left,
    growBy: new NumberRange(0.05, 0.05),
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
      growBy: new NumberRange(0.05, 0.05),
      //   visibleRange: new NumberRange(0, 60),
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

  const boxPlotDataSeries = new BoxPlotDataSeries(wasmContext, {
    xValues,
    minimumValues: minimumValues.reverse(),
    maximumValues,
    medianValues: medianValues.reverse(),
    lowerQuartileValues,
    upperQuartileValues: upperQuartileValues.reverse(),
  });

  const boxSeries = new FastBoxPlotRenderableSeries(wasmContext, {
    dataSeries: boxPlotDataSeries,
    stroke: appTheme.Black,
    strokeThickness: 1,
    dataPointWidthMode: EDataPointWidthMode.Relative,
    dataPointWidth: 0.5,
    fill: appTheme.VividGreen,
    opacity: 0.6,
    // strokeDashArray: [5, 7], // support for the box does not work ???
    whiskers: {
      stroke: appTheme.VividGreen,
      strokeThickness: 2,
      //   strokeDashArray: [5, 5],
    },
    cap: {
      stroke: appTheme.VividGreen,
      strokeThickness: 2,
      dataPointWidth: 0.3,
    },
    medianLine: {
      stroke: appTheme.Black,
      strokeThickness: 2,
    },
  });
  sciChartSurface.renderableSeries.add(boxSeries);

  return { sciChartSurface };
};

export const boxplotInitializationFunction3 = async (
  rootElement: string | HTMLDivElement
): Promise<{ sciChartSurface: SciChartSurface }> => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: appTheme.SciChartJsTheme,
    }
  );

  const isVertical = true;
  const isXCategoryAxis = false;

  const configCategoryAxis: ICategoryAxisOptions = {
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
    cursorLabelFormat: ENumericFormat.Decimal,
    cursorLabelPrecision: 0,
  };

  const configX = {
    labelProvider: new CustomLabelProvider(),
    axisAlignment: isVertical ? EAxisAlignment.Bottom : EAxisAlignment.Left,
    growBy: new NumberRange(0.05, 0.05),
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
      growBy: new NumberRange(0.05, 0.05),
      //   visibleRange: new NumberRange(0, 60),
      autoRange: EAutoRange.Once,
      flippedCoordinates: !isVertical,
    })
  );

  const xValues = [4, 5, 6];
  const minimumValues = [0, 1, 0.5];
  const maximumValues = [8, 9, 10];
  const medianValues = [4.5, 4, 5];
  const lowerQuartileValues = [3, 2, 3.5];
  const upperQuartileValues = [7, 6, 6.5];

  const boxPlotDataSeries = new BoxPlotDataSeries(wasmContext, {
    xValues,
    minimumValues,
    maximumValues: maximumValues.reverse(),
    medianValues,
    lowerQuartileValues: lowerQuartileValues.reverse(),
    upperQuartileValues,
  });

  const boxSeries = new FastBoxPlotRenderableSeries(wasmContext, {
    dataSeries: boxPlotDataSeries,
    stroke: appTheme.VividRed,
    strokeThickness: 1,
    dataPointWidthMode: EDataPointWidthMode.Relative,
    dataPointWidth: 0.5,
    fill: appTheme.VividRed,
    opacity: 0.6,
    // strokeDashArray: [5, 7], // support for the box does not work ???
    whiskers: {
      stroke: appTheme.VividRed,
      strokeThickness: 2,
      //   strokeDashArray: [5, 5],
    },
    cap: {
      stroke: appTheme.VividRed,
      strokeThickness: 2,
      dataPointWidth: 0.3,
    },
    medianLine: {
      stroke: appTheme.VividRed,
      strokeThickness: 2,
    },
  });
  sciChartSurface.renderableSeries.add(boxSeries);

  return { sciChartSurface };
};

export const boxplotInitializationFunction4 = async (
  rootElement: string | HTMLDivElement
): Promise<{ sciChartSurface: SciChartSurface }> => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: appTheme.SciChartJsTheme,
    }
  );

  const isVertical = false;
  const isXCategoryAxis = false;

  const configCategoryAxis: ICategoryAxisOptions = {
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
    cursorLabelFormat: ENumericFormat.Decimal,
    cursorLabelPrecision: 0,
  };

  const configX = {
    labelProvider: new CustomLabelProvider(),
    axisAlignment: isVertical ? EAxisAlignment.Bottom : EAxisAlignment.Left,
    growBy: new NumberRange(0.05, 0.05),
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
      growBy: new NumberRange(0.05, 0.05),
      //   visibleRange: new NumberRange(0, 60),
      autoRange: EAutoRange.Once,
      flippedCoordinates: !isVertical,
    })
  );

  const xValues = [4, 5, 6];
  const minimumValues = [0, 0, 0.5];
  const maximumValues = [10, 9, 8];
  const medianValues = [4.5, 4, 5];
  const lowerQuartileValues = [3, 2, 3.5];
  const upperQuartileValues = [7, 6, 6.5];

  const boxPlotDataSeries = new BoxPlotDataSeries(wasmContext, {
    xValues,
    minimumValues,
    maximumValues: maximumValues.reverse(),
    medianValues: medianValues.reverse(),
    lowerQuartileValues: lowerQuartileValues.reverse(),
    upperQuartileValues,
  });

  const boxSeries = new FastBoxPlotRenderableSeries(wasmContext, {
    dataSeries: boxPlotDataSeries,
    stroke: appTheme.MutedBlue,
    strokeThickness: 1,
    dataPointWidthMode: EDataPointWidthMode.Relative,
    dataPointWidth: 0.5,
    fill: appTheme.MutedBlue,
    opacity: 0.4,
    // strokeDashArray: [5, 7], // support for the box does not work ???
    whiskers: {
      stroke: appTheme.MutedBlue,
      strokeThickness: 2,
      //   strokeDashArray: [5, 5],
    },
    cap: {
      stroke: appTheme.MutedBlue,
      strokeThickness: 2,
      dataPointWidth: 0.3,
    },
    medianLine: {
      stroke: appTheme.MutedBlue,
      strokeThickness: 2,
    },
  });
  sciChartSurface.renderableSeries.add(boxSeries);

  return { sciChartSurface };
};
