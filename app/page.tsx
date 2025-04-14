"use client";

import { SciChartReact } from "scichart-react";
import {
  boxplotInitializationFunction1,
  boxplotInitializationFunction2,
  boxplotInitializationFunction3,
  boxplotInitializationFunction4,
} from "./boxPlotCharts";
/**
 * A function executed within SciChartReact with provided chart root element,
 * creates a SciChartSurface instance and returns a reference to it.
 *
 * @param {string | HTMLDivElement} rootElement
 * @returns {Promise<{sciChartSurface: SciChartSurface}>}
 */

const BasicChartWithInitFunction = () => (
  <div className="flex flex-row min-h-screen justify-center items-center">
    <div style={{ width: 900, height: 600, display: "flex", flexWrap: "wrap" }}>
      <SciChartReact
        style={{ width: "50%", height: 300 }}
        initChart={boxplotInitializationFunction1}
      />
      <SciChartReact
        style={{ width: "50%", height: 300 }}
        initChart={boxplotInitializationFunction2}
      />
      <SciChartReact
        style={{ width: "50%", height: 300 }}
        initChart={boxplotInitializationFunction3}
      />
      <SciChartReact
        style={{ width: "50%", height: 300 }}
        initChart={boxplotInitializationFunction4}
      />
    </div>
  </div>
);

export default BasicChartWithInitFunction;
