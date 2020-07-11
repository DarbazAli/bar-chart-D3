
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




const URL = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

fetch( URL )
.then( res => res.json())
.then( json => {
    const data  = json["data"];
    // console.log(data);
    
})