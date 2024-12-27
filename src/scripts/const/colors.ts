export const colors = ['#1571fe', '#008800', '#e8cb29'];
export const splitColors = ['#2b14ff', '#008743', '#ba9f05'];
export const mergedColors = Array.from(
    {length:colors.length*2}, 
    (_,i) => i % 2 ? colors[Math.trunc(i/2)] : splitColors[Math.trunc((i-1)/2)]);
