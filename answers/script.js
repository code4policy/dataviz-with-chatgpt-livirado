// Set dimensions with increased right margin for labels
const margin = {top: 80, right: 150, bottom: 80, left: 250};  // increased top margin
const width = 1200 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Create SVG
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create static data array from CSV content
const data = [
    {reason: "Enforcement & Abandoned Vehicles", Count: 61541},
    {reason: "Sanitation", Count: 59389},
    {reason: "Street Cleaning", Count: 45659},
    {reason: "Code Enforcement", Count: 31812},
    {reason: "Highway Maintenance", Count: 25096},
    {reason: "Signs & Signals", Count: 11209},
    {reason: "Trees", Count: 10390},
    {reason: "Recycling", Count: 9955},
    {reason: "Street Lights", Count: 8499},
    {reason: "Park Maintenance & Safety", Count: 7932}
].sort((a, b) => b.Count - a.Count);

// Create scales
const y = d3.scaleBand()
    .range([0, height])
    .padding(0.1);

const x = d3.scaleLinear()
    .range([0, width]);

// Set domains
y.domain(data.map(d => d.reason));
x.domain([0, d3.max(data, d => d.Count)]);

// Add bars
svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("y", d => y(d.reason))
    .attr("height", y.bandwidth())
    .attr("x", 0)
    .attr("width", d => x(d.Count))
    .style("fill", "gray");

// Add X axis at the top
svg.append("g")
    .call(d3.axisTop(x)
    .ticks(10)
    .tickFormat(d3.format(",d")));

// Add Y axis
svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("font-size", "12px");

// Add title
svg.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -60)  // increased spacing
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    

// Add X axis label
svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", -margin.top/1.5)  // adjusted spacing
    .style("text-anchor", "middle")
    .text("Number of Calls");

// Add value labels on bars
svg.selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("y", d => y(d.reason) + y.bandwidth() / 2)
    .attr("x", d => x(d.Count) + 10)
    .attr("dy", ".35em")
    .style("font-size", "12px")
    .text(d => d3.format(",")(d.Count));

// Add hover effects
svg.selectAll(".bar")
    .on("mouseover", function() {
        d3.select(this)
            .style("fill", "darkgray");
    })
    .on("mouseout", function() {
        d3.select(this)
            .style("fill", "gray");
    });

// Add citation and authorship footnote
svg.append("text")
    .attr("class", "footnote")
    .attr("x", 0)
    .attr("y", height + 60)
    .style("font-size", "12px")
    .style("fill", "gray")
    .text("Data Source: Boston 311 Service Requests (2023) | Chart by LR&Perplexity AI | Updated: January 15, 2025, 2 PM EST");
