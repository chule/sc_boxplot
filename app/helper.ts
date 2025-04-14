export function generateBoxplotData(data: number[]) {
  // Sort the data in ascending order
  data.sort((a, b) => a - b);

  // Helper function to calculate the median
  function calculateMedian(arr: number[]) {
    const mid = Math.floor(arr.length / 2);
    if (arr.length % 2 === 0) {
      // If even, average the two middle numbers
      return (arr[mid - 1] + arr[mid]) / 2;
    } else {
      // If odd, return the middle number
      return arr[mid];
    }
  }

  const min = data[0]; // Minimum value
  const max = data[data.length - 1]; // Maximum value
  const median = calculateMedian(data); // Median (Q2)

  // Split data into lower and upper halves for quartiles
  const lowerHalf = data.slice(0, Math.floor(data.length / 2));
  const upperHalf = data.slice(Math.ceil(data.length / 2));

  const q1 = calculateMedian(lowerHalf); // First Quartile (Q1)
  const q3 = calculateMedian(upperHalf); // Third Quartile (Q3)
  const iqr = q3 - q1; // Interquartile Range (IQR)

  return {
    min,
    q1,
    median,
    q3,
    max,
    iqr,
  };
}
