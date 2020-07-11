
// SELECT 
const container = d3.select(".container");

// TITLE 
container
    .append("h1")
    .attr("id", "title")
    .text("Gross Domestic Product");


// MARGINS
const margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 50
}

// CANVAS HIGHT AND WIDTH
const width = 800 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;



// CANVAS
const canvas = container.append('svg')
.attr("viewBox", `0 0 ${width + margin.left + margin.right}  ${height + margin.top + margin.bottom}`);



const axisGroups = canvas.append('g')
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




const apiURL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch( apiURL )
.then( res => res.json())
.then( json => {
    const data  = json["data"];
    // console.log(data);
    drawBarChart(data)
});




const drawBarChart = data => {

    data.forEach( d => {
        d[0] = parseTime(d[0]);
        d[1] = +d[1]
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


    // X Axis bar
    axisGroups
            .append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis)
    // Y Axis Bar
    axisGroups
            .append('g')
            .attr('id', 'y-axis')
            .call(yAxis)


    // TOOLTIP
    // include a tooltip through a div element
    const tooltip = container
                        .append("div")
                        .attr("id", "tooltip");


    // PLOT CHART
    canvas.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')

            .on("mouseenter", (d) => {
                tooltip 
                    // alter the opacity to make the tooltip visible
                    .style("opacity", 1)
                    // position the tooltip close to the cursor, using the d3.event object
                    // console.log() this object to establish which properties are needed
                    .style("left", `${d3.event.layerX - 150}px`)
                    .style("top", `${d3.event.layerY - 80}px`)
                    // include a data-date property which describes the date of the connected rectangle element
                    // date formatted through the defined format function
                    .attr("data-date", formatTime(d[0]))
                    .text(() => {
                        // d[0], as it is processed through the parse function, represents an instance of the date object
                        // getFullYear() allows to retrieve the four-digit year 
                        let year = d[0].getFullYear();
                        let quarter = (d[0].getMonth() == 0) ? "Q1" : (d[0].getMonth() == 3) ? "Q2" : (d[0].getMonth() == 6) ? "Q3" : "Q4";
    
                        return `${year} ${quarter} ${d[1]}`;
                    });
            })
            .on("mouseout", () => {
                tooltip
                    .style("opacity", 0);
            })

            // parse data to data holders
            .attr('data-date', d => formatTime(d[0]))
            .attr('data-gdp', d => d[1])

            .attr('x', (d, i) => (width / data.length) * i )
            .attr('y', d => yScale(d[1]))

            .attr('width', width / data.length )
            .attr('height', d => height - yScale(d[1]))

            .attr('class', 'bar')

}

