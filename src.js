'use strict';

// Use d3 to process data and call plotting function
const initializePlot = () => {
    d3.csv("/Admission_Predict.csv", plotData);
}

// Creates and displays axes, labels, and histogram
const plotData = (data) => {

    const marginTop = 10,
        marginRight = 30,
        marginBottom = 40,
        marginLeft = 40;

    const width = 460 - marginLeft - marginRight;
    const height = 400 - marginTop - marginBottom;

    const svg = createSVG(width, height, marginLeft, marginRight, marginTop, marginBottom);

    const x = createAndPlotXAxis(svg, width, height, marginTop);

    const bins = calculateBins(data, x);

    const y = createAndPlotYAxis(svg, bins, height, marginLeft);

    plotBars(svg, bins, x, y, height);
}

// Uses d3 to create the svg element
const createSVG = (width, height, marginLeft, marginRight, marginTop, marginBottom) => {
    return d3.select("#barGraphContainer")
        .append("svg")
        .attr("width", width + marginLeft + marginRight)
        .attr("height", height + marginTop + marginBottom)
        .append("g")
        .attr("transform",
            "translate(" + marginLeft + "," + marginTop + ")");
}

// Creates an x scale, appends an axis to our svg element, and labels the axis
const createAndPlotXAxis = (svg, width, height, marginTop) => {
    const x = d3.scaleLinear()
        .domain([90, 125])
        .range([0, width]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    svg.append("text")
        .attr("transform",
            "translate(" + (width / 2) + " ," +
            (height + marginTop + 20) + ")")
        .style("text-anchor", "middle")
        .text("TOEFL Score (bins)");

    return x;
}

// Calculates bins for our specific data
const calculateBins = (data, x) => {
    const histogram = d3.histogram()
        .value(function (d) { return d["TOEFL Score"]; })
        .domain(x.domain())
        .thresholds(x.ticks(7));

    return histogram(data);
}

// Creates an y scale, appends an axis to our svg element, and labels the axis
const createAndPlotYAxis = (svg, bins, height, marginLeft) => {

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(bins, function (d) { return d.length; })]);

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - marginLeft)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Count of TOEFL Score");

    return y;
}

// Plots the bars using the bins we calculate using the data
const plotBars = (svg, bins, x, y, height) => {
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
        .style("fill", "#add8e6")
        .attr("x", 1)
        .attr("transform", function (d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function (d) { return (x(d.x1) - x(d.x0) == 0) ? x(d.x1) - x(d.x0) : x(d.x1) - x(d.x0) - 1; })
        .attr("height", function (d) { return height - y(d.length); });
}

// Launches our main function
initializePlot();