

// SELECT 
const container = d3.select(".container");

// TITLE 
container
    .append("h1")
    .attr("id", "title")
    .text("Gross Domestic Product");

// FRAME

const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 50
}


const width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;


const containerCanvas = container
                            .append("svg")
                            .attr("viewBox", `0 0 ${width + margin.left + margin.right}  ${height + margin.top + margin.bottom}`);


const canvasContents = containerCanvas
                            .append("g")
                            .attr("transform", `translate(${margin.left}, ${margin.top})`);

// SCALES
const xScale = d3
                .scaleTime()
                .range([0, width]);

const yScale = d3
                .scaleLinear()
                .range([height, 0]);


const parseTime = d3
                    .timeParse("%Y-%m-%d");


const formatTime = d3.timeFormat("%Y-%m-%d");


const drawTooltip = ( d, tooltip) => {
    tooltip 

        .style("opacity", 1)

        .style("left", `${d3.event.layerX - 100}px`)
        .style("top", `${d3.event.layerY - 40}px`)

        .attr("data-date", formatTime(d[0]))
        .text(() => {

            let year = d[0].getFullYear();
            let quarter = (d[0].getMonth() == 0) ? "Q1" : (d[0].getMonth() == 3) ? "Q2" : (d[0].getMonth() == 6) ? "Q3" : "Q4";

            return `${year} ${quarter} $${d[1]} Billion`;
        });
}



const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch( URL )
.then( res => res.json())
.then( json => {
    const data = json["data"]
    drawBarChart(data)
})


function drawBarChart(data) {

    // FORMAT DATA
    data.forEach((d) => {
        d[0] = parseTime(d[0]);
        d[1] = +d[1];
    });


    // DOMAIN
    xScale
        .domain(d3.extent(data, d => d[0]));
        
        yScale
        .domain(d3.extent(data, d => d[1]))
        .nice();
       
    // AXES 
    // initialize the axes based on the scales
    const xAxis = d3
                    .axisBottom(xScale);
    const yAxis = d3
                    .axisLeft(yScale);


    canvasContents
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    canvasContents
        .append("g")
        .attr("id", "y-axis")
        .call(yAxis);

    // TOOLTIP
    const tooltip = container
                        .append("div")
                        .attr("id", "tooltip");

    // PLOT CHART
    canvasContents
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")

        .on("mouseenter", (d) => drawTooltip(d, tooltip))

        .on("mouseout", () => {
            tooltip
                .style("opacity", 0);
        })

        .attr("data-date", (d) => formatTime(d[0]))
        .attr("data-gdp", (d) => d[1])

        .attr("x", (d, i) => (width/ data.length) * i)
        .attr("y", (d) => yScale(d[1]))

        .attr("width", (width/ data.length))
        .attr("height", (d) => height - yScale(d[1]))

        .attr("class", "bar");
}



