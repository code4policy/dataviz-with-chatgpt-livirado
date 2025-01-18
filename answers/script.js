// Set dimensions with increased right margin for labels
const margin = {top: 80, right: 150, bottom: 80, left: 250};
const width = 1200 - margin.left - margin.right;
let height = 800 - margin.top - margin.bottom;

// Create SVG container with a wrapper div
d3.select("#chart")
    .append("div")
    .style("position", "relative");

// Create SVG
const svg = d3.select("#chart div")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create static data array from CSV content
const fullData = [
    {reason: "Enforcement & Abandoned Vehicles", Count: 61541},
    {reason: "Sanitation", Count: 59389},
    {reason: "Street Cleaning", Count: 45659},
    {reason: "Code Enforcement", Count: 31812},
    {reason: "Highway Maintenance", Count: 25096},
    {reason: "Signs & Signals", Count: 11209},
    {reason: "Trees", Count: 10390},
    {reason: "Recycling", Count: 9955},
    {reason: "Street Lights", Count: 8499},
    {reason: "Park Maintenance & Safety", Count: 7932},
    {reason: "Housing", Count: 7590},
    {reason: "Needle Program", Count: 7413},
    {reason: "Building", Count: 5209},
    {reason: "Environmental Services", Count: 4416},
    {reason: "Animal Issues", Count: 4155},
    {reason: "Employee & General Comments", Count: 2166},
    {reason: "Administrative & General Requests", Count: 2025},
    {reason: "Graffiti", Count: 1839},
    {reason: "Health", Count: 1349},
    {reason: "Abandoned Bicycle", Count: 1318},
    {reason: "Noise Disturbance", Count: 832},
    {reason: "Traffic Management & Engineering", Count: 751},
    {reason: "Catchbasin", Count: 621},
    {reason: "Notification", Count: 607},
    {reason: "Sidewalk Cover / Manhole", Count: 291},
    {reason: "Operations", Count: 283},
    {reason: "Fire Hydrant", Count: 205},
    {reason: "General Request", Count: 196},
    {reason: "Generic Noise Disturbance", Count: 109},
    {reason: "Pothole", Count: 85},
    {reason: "Boston Bikes", Count: 64},
    {reason: "Weights and Measures", Count: 52},
    {reason: "Air Pollution Control", Count: 35},
    {reason: "Cemetery", Count: 29},
    {reason: "Neighborhood Services Issues", Count: 28},
    {reason: "Parking Complaints", Count: 19},
    {reason: "Office of The Parking Clerk", Count: 18},
    {reason: "Bridge Maintenance", Count: 8},
    {reason: "Massport", Count: 8},
    {reason: "Valet", Count: 7},
    {reason: "Billing", Count: 6},
    {reason: "Programs", Count: 6},
    {reason: "Alert Boston", Count: 3},
    {reason: "MBTA", Count: 1}
].sort((a, b) => b.Count - a.Count);

let currentData = fullData.slice(0, 10);
let isShowingAll = false;

// Create scales
const y = d3.scaleBand()
    .padding(0.1);

const x = d3.scaleLinear();

// Function to update chart
function updateChart(data) {
    height = data.length * 40;
    
    y.range([0, height])
        .domain(data.map(d => d.reason));
    
    x.range([0, width])
        .domain([0, d3.max(data, d => d.Count)]);

    d3.select("#chart div svg")
        .attr("height", height + margin.top + margin.bottom);

    const bars = svg.selectAll(".bar")
        .data(data);

    bars.exit().remove();

    const newBars = bars.enter()
        .append("rect")
        .attr("class", "bar");

    bars.merge(newBars)
        .transition()
        .duration(750)
        .attr("y", d => y(d.reason))
        .attr("height", y.bandwidth())
        .attr("x", 0)
        .attr("width", d => x(d.Count))
        .style("fill", "gray");

    svg.selectAll(".x-axis").remove();
    svg.selectAll(".y-axis").remove();

    svg.append("g")
        .attr("class", "x-axis")
        .call(d3.axisTop(x)
        .tickFormat(d3.format(",d")));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    const labels = svg.selectAll(".label")
        .data(data);

    labels.exit().remove();

    const newLabels = labels.enter()
        .append("text")
        .attr("class", "label");

    labels.merge(newLabels)
        .transition()
        .duration(750)
        .attr("y", d => y(d.reason) + y.bandwidth() / 2)
        .attr("x", d => x(d.Count) + 10)
        .attr("dy", ".35em")
        .style("font-size", "12px")
        .text(d => d3.format(",")(d.Count));

    // Update footnote position
    svg.select(".footnote")
        .attr("y", height + 60);
}

// Add toggle button
d3.select("#chart div")
    .append("button")
    .attr("class", "toggle-button")
    .style("position", "absolute")
    .style("top", "10px")
    .style("right", "10px")
    .text("Show All Results")
    .on("click", function() {
        isShowingAll = !isShowingAll;
        this.textContent = isShowingAll ? "Show Top 10" : "Show All Results";
        updateChart(isShowingAll ? fullData : fullData.slice(0, 10));
    });

// Initial render
updateChart(currentData);

// Add title
svg.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -60)
    .style("text-anchor", "middle")
    .style("font-size", "16px")
   

// Add X axis label
svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", -margin.top/1.5)
    .style("text-anchor", "middle")
    .text("Number of Calls");

// Add citation and authorship footnote
svg.append("text")
    .attr("class", "footnote")
    .attr("x", 0)
    .attr("y", height + 60)
    .style("font-size", "12px")
    .style("fill", "gray")
    .text("Data Source: Boston 311 Service Requests (2023) | Chart by Livi & Perplexity AI | Updated: Wednesday, January 15, 2025, 4 PM EST");
