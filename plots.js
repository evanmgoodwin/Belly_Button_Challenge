function init() {
    var selector = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    })

    buildMetadata(940);

    buildCharts(940);
};

init();

//////////////////////////////////////////////////////////////

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
};

//////////////////////////////////////////////////////////////

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        PANEL.append("h6").text("ID: " + result.id);
        PANEL.append("h6").text("ETHNICITY: " + result.ethnicity);
        PANEL.append("h6").text("GENDER: " + result.gender);
        PANEL.append("h6").text("AGE: " + result.age);
        PANEL.append("h6").text("LOCATION: " + result.location);
        PANEL.append("h6").text("BBTYPE: " + result.bbtype);
        PANEL.append("h6").text("WFREQ: " + result.wfreq);
    });
};

//////////////////////////////////////////////////////////////

function buildCharts(sample) {
    d3.json("samples.json").then((data) => {
        
        var samples = data.samples;
        var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = sampleArray[0];

        var metadata = data.metadata;
        var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var mdresult = metadataArray[0];

        var otuIDs = result.otu_ids;
        var otuLabels = result.otu_labels;
        var sampleValues = result.sample_values;

        // BAR PLOT

        var yAxis = otuIDs.map(num => "OTU " + num);
        
        var barTrace = {
            x: sampleValues.slice(0, 10),
            y: yAxis.slice(0, 10),
            type: "bar",
            orientation: "h",
            marker: {color: "#F7BCC0"},
            text: otuLabels.slice(0, 10)
        };
        
        var graphData = [barTrace];
        
        var layout = {yaxis: {autorange: "reversed"},
        };
        
        Plotly.newPlot("bar", graphData, layout);

        //////////////////////////////////////////////////////////////

        // GUAGE

        var gaugeTrace =
            {
              type: "indicator",
              mode: "gauge+number",
              value: mdresult.wfreq,
              title: { text: "Belly Button Washing Frequency Per Week", font: { size: 20 } },
              gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" },
                bar: { color: "#F7BCC0" },
                bgcolor: "white",
                steps: [
                  {range: [0, 1], color: "#C0D4C2"},
                  {range: [1, 2], color: "#EDEEDE"},
                  {range: [2, 3], color: "#C0D4C2"},
                  {range: [3, 4], color: "#EDEEDE"},
                  {range: [4, 5], color: "#C0D4C2"},
                  {range: [5, 6], color: "#EDEEDE"},
                  {range: [6, 7], color: "#C0D4C2"},
                  {range: [7, 8], color: "#EDEEDE"},
                  {range: [8, 9], color: "#C0D4C2"} 
                ],
              }
            };
        
          var gaugeData = [gaugeTrace];

          var layout = {
            width: 500,
            height: 400,
            margin: { t: 25, r: 25, l: 25, b: 25 },
            paper_bgcolor: "white"
        
          };
          
          Plotly.newPlot("gauge", gaugeData, layout);

        //////////////////////////////////////////////////////////////

        // BUBBLE CHART

        var bubbleTrace = {
            x: otuIDs,
            y: sampleValues,
            mode: "markers",
            text: otuLabels,
            marker: {
              color: otuIDs,
              size: sampleValues
            }
          };
          
          var bubbleData = [bubbleTrace];
          
          var layout = {
            showlegend: false,
            height: 600,
            width: 1200
          };
          
          Plotly.newPlot("bubble", bubbleData, layout);

        //////////////////////////////////////////////////////////////

    });
};