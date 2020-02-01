'use strict';

const colors = {

    "Bug": "#4E79A7",

    "Dark": "#A0CBE8",

    "Electric": "#F28E2B",

    "Fairy": "#FFBE&D",

    "Fighting": "#59A14F",

    "Fire": "#8CD17D",

    "Ghost": "#B6992D",

    "Grass": "#499894",

    "Ground": "#86BCB6",

    "Ice": "#86BCB6",

    "Normal": "#E15759",

    "Poison": "#FF9D9A",

    "Psychic": "#79706E",

    "Steel": "#BAB0AC",

    "Water": "#D37295"

}

// Use d3 to process data and call plotting function
const initializePlot = () => {
    d3.csv("/pokemon.csv", plotData);
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

    const x = createAndPlotXAxis(svg, width, height);

    const y = createAndPlotYAxis(svg, height);

    const pokemonPlot = plotPoints(svg, data, x, y);

    setFilterListeners(svg, data, pokemonPlot, x, y);
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

// Creates an x scale, appends an axis to our svg element, and labels the axis
const createAndPlotXAxis = (svg, width, height) => {

    const x = d3.scaleLinear()
        .domain([0, 240])
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
const createAndPlotYAxis = (svg, height) => {

    const y = d3.scaleLinear()
        .domain([0, 800])
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

// Plots all points
const plotPoints = (svg, data, x, y) => {

    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    var tooltip = d3.select("body")
        .append("div")
        .style("opacity", 1)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "6px")

    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
    }

    var mousemove = function (d) {
        tooltip
            .html("Name: " + d["Name"])
            .style("left", (d3.mouse(this)[0] + 60) + "px")
            .style("top", (d3.event.pageY - 30) + "px");
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function (d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 1)
    }

    const pokemonPlot = svg
        .selectAll(".markers")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", 'markers')
        .attr("cx", function (d) { return x(d["Sp. Def"]); })
        .attr("cy", function (d) { return y(d["Total"]); })
        .attr("r", 3)
        .style("fill", "#69b3a2")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    return pokemonPlot;
}

const setFilterListeners = (svg, data, pokemonPlot, x, y) => {
    document.getElementById("legendaryAll").onclick = (evt) => {
        updateLegendaryFilter(svg, data, pokemonPlot, x, y, "All");
    }
    document.getElementById("legendaryTrue").onclick = (evt) => {
        updateLegendaryFilter(svg, data, pokemonPlot, x, y, "True");
    }
    document.getElementById("legendaryFalse").onclick = (evt) => {
        updateLegendaryFilter(svg, data, pokemonPlot, x, y, "False");
    }
}

// Updates legendary filter based on user input
const updateLegendaryFilter = (svg, data, pokemonPlot, x, y, legendaryFilter) => {

    var filteredData = data.filter(function (d) { return d["Legendary"] === "True" });

    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    var tooltip = d3.select("#scatterPlotContainer")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")



    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
    }

    var mousemove = function (d) {
        tooltip
            .html("Pokemon Name: " + d["Name"])
            .style("left", (d3.mouse(this)[0] + 90) + "px")
            .style("top", (d3.mouse(this)[1]) + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    var mouseleave = function (d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }


    x.domain([d3.min(filteredData, function (d) { return +d["Sp. Def"] }), d3.max(filteredData, function (d) { return +d["Sp. Def"] })]);

    svg.selectAll(".myXaxis").transition()
        .duration(3000)
        .call(d3.axisBottom(x));

    y.domain([d3.min(filteredData, function (d) { return +d["Total"] }), d3.max(filteredData, function (d) { return +d["Total"] })]);

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
        .style("fill", "red")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    plot.merge(enter).transition().duration(3000)
        .style("fill", '#ff0000')
        .attr("cx", function (d) { return x(d["Sp. Def"]); })
        .attr("cy", function (d) { return y(d["Total"]); })

    plot
        .exit()
        .remove();
}

// Launches our main function
initializePlot();