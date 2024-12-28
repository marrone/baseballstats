// these are the main colors
export const colors = ['#1571fe', '#08df08', '#e8cb29', '#f00000', '#c703ff'];
// contrast colors for each of the main colors, to be used for split graphs
export const splitColors = ['#0040a2', '#008800', '#ba9f05', '#9d0000', '#740095'];
// this is the interleaved combination of both sets above
export const mergedColors = Array.from(
    {length:colors.length*2}, 
    (_,i) => i % 2 ? colors[Math.trunc(i/2)] : splitColors[Math.trunc(i/2)]);
