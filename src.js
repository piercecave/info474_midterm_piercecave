'use strict';

const colors = {

    "Bug": "#4E79A7",

    "Dark": "#A0CBE8",

    "Electric": "#F28E2B",

    "Fairy": "#b19cd9",

    "Fighting": "#59A14F",

    "Fire": "#8CD17D",

    "Ghost": "#B6992D",

    "Grass": "#499894",

    "Ground": "#86BCB6",

    "Ice": "#add8e6",

    "Normal": "#E15759",

    "Poison": "#FF9D9A",

    "Psychic": "#79706E",

    "Steel": "#BAB0AC",

    "Water": "#D37295"

}

var state = {
    "legendary": "All",
    "generation": "All"
}

// Use d3 to process data and call plotting function
const initializePlot = () => {
    d3.csv("pokemon.csv", plotData);
}

// Creates and displays axes, labels, and histogram
const plotData = (data) => {

    const marginTop = 48,
        marginRight = 48,
        marginBottom = 48,
        marginLeft = 48;

    const width = 768 - marginLeft - marginRight;
    const height = 464 - marginTop - marginBottom;

    const svg = createSVG(width, height, marginLeft, marginRight, marginTop, marginBottom);

    const x = createAndPlotXAxis(svg, data, width, height);

    const y = createAndPlotYAxis(svg, data, height);

    const tooltip = createTooltip();

    const pokemonPlot = plotPoints(svg, data, x, y, tooltip);

    setFilterListeners(svg, data, pokemonPlot, x, y, tooltip);

    createLegend();
}

// Uses d3 to create the svg element
const createSVG = (width, height, marginLeft, marginRight, marginTop, marginBottom) => {
    return d3.select("#scatterPlotContainer")
        .append("svg")
        .attr("width", width + marginLeft + marginRight)
        .attr("height", height + marginTop + marginBottom)
        .append("g")
        .attr("transform",
            "translate(" + marginLeft + "," + marginTop + ")");
}

// Creates Type1 Legend
const createLegend = () => {
    const ul = document.getElementById("type1Legend");
    const entries = Object.entries(colors);
    for (const [type, color] of entries) {
        var li = document.createElement("li");  

        var colorBox = document.createElement("div");  
        colorBox.classList.add("color-box");
        colorBox.style.background = color;
        li.appendChild(colorBox);

        var textnode = document.createTextNode(type);
        li.appendChild(textnode);

        ul.appendChild(li);
    }
}

// Creates an x scale, appends an axis to our svg element, and labels the axis
const createAndPlotXAxis = (svg, data, width, height) => {

    const x = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return +d["Sp. Def"] }) * .7, d3.max(data, function (d) { return +d["Sp. Def"] }) * 1.3])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)).attr("class", "myXaxis");



    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + 36) + ")")
        .style("text-anchor", "middle")
        .text("Sp. Defense");

    return x;
}

// Creates an y scale, appends an axis to our svg element, and labels the axis
const createAndPlotYAxis = (svg, data, height) => {

    const y = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return +d["Total"] }) * .7, d3.max(data, function (d) { return +d["Total"] }) * 1.3])
        .range([height, 0]);

    svg.append("g")
        .call(d3.axisLeft(y)).attr("class", "myYaxis");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -48)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Total Stats");

    return y;
}

// Creates tooltip
const createTooltip = () => {
    const tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "6px")

    return tooltip;
}

// Plots all points
const plotPoints = (svg, data, x, y, tooltip) => {

    const pokemonPlot = svg
        .selectAll(".markers")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", 'markers')
        .attr("cx", function (d) { return x(d["Sp. Def"]); })
        .attr("cy", function (d) { return y(d["Total"]); })
        .attr("r", 3)
        .style("fill", function (d) { return colors[d["Type 1"]]; })
        .on("mouseover", (d) => { mouseover(d, tooltip) })
        .on("mousemove", (d) => { mousemove(d, tooltip) })
        .on("mouseleave", (d) => { mouseleave(d, tooltip) });

    return pokemonPlot;
}

const setFilterListeners = (svg, data, pokemonPlot, x, y, tooltip) => {
    document.getElementById("legendaryAll").onclick = (evt) => {
        state.legendary = "All";
        update(svg, data, pokemonPlot, x, y, tooltip);
    }
    document.getElementById("legendaryTrue").onclick = (evt) => {
        state.legendary = "True";
        update(svg, data, pokemonPlot, x, y, tooltip);
    }
    document.getElementById("legendaryFalse").onclick = (evt) => {
        state.legendary = "False";
        update(svg, data, pokemonPlot, x, y, tooltip);
    }
    document.getElementById("generationSelect").onchange = (evt) => {
        state.generation = document.getElementById("generationSelect").value;
        update(svg, data, pokemonPlot, x, y, tooltip);
    }
}

// Updates legendary filter based on user input
const update = (svg, data, pokemonPlot, x, y, tooltip) => {

    var filteredData = data.filter(function (d) { return dataFilterLogic(d) });

    x.domain([d3.min(filteredData, function (d) { return +d["Sp. Def"] }) * .7, d3.max(filteredData, function (d) { return +d["Sp. Def"] }) * 1.3])

    svg.selectAll(".myXaxis").transition()
        .duration(3000)
        .call(d3.axisBottom(x));

    y.domain([d3.min(filteredData, function (d) { return +d["Total"] }) * .7, d3.max(filteredData, function (d) { return +d["Total"] }) * 1.3]);

    svg.selectAll(".myYaxis")
        .transition()
        .duration(3000)
        .call(d3.axisLeft(y));

    var plot = svg.selectAll(".markers")
        .data(filteredData);

    var enter = plot
        .enter()
        .append("circle")
        .attr("class", 'markers')
        .attr("cx", function (d) { return x(d["Sp. Def"]); })
        .attr("cy", function (d) { return y(d["Total"]); })
        .attr("r", 3)
        .style("fill", function (d) { return colors[d["Type 1"]]; })
        .on("mouseover", (d) => { mouseover(d, tooltip) })
        .on("mousemove", (d) => { mousemove(d, tooltip) })
        .on("mouseleave", (d) => { mouseleave(d, tooltip) });

    plot.merge(enter).transition().duration(3000)
        .style("fill", function (d) { return colors[d["Type 1"]]; })
        .attr("cx", function (d) { return x(d["Sp. Def"]); })
        .attr("cy", function (d) { return y(d["Total"]); })

    plot
        .exit()
        .remove();
}

const dataFilterLogic = (d) => {
    var keepData = true;

    if (state.legendary != "All") {
        keepData = d["Legendary"] === state.legendary;
    }

    if (state.generation != "All") {
        if (keepData) {
            keepData = d["Generation"] === state.generation;
        }
    }

    return keepData;
}

const mouseover = (d, tooltip) => {
    tooltip
        .style("opacity", 1)
}

const mousemove = (d, tooltip) => {
    tooltip
        .html(d["Name"] + "<br>" + d["Type 1"] + "<br>" + d["Type 2"])
        .style("left", (d3.event.pageX + 60) + "px")
        .style("top", (d3.event.pageY - 30) + "px");
}

const mouseleave = (d, tooltip) => {
    tooltip
        .transition()
        .style("opacity", 0)
}

// Launches our main function
initializePlot();