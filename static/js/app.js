// thank you stackoverflow, this was one weird workaround.
const jsonpath = "https://gist.githubusercontent.com/glovessoldout/d248fdb304cfe9f9cd06f57018d91244/raw/da111b5efa4c2e9821c474a102f4bd1ccf031315/gistfile1.txt";

d3.json(jsonpath).then(function(data){
    console.log(data);
});

d3.json(jsonpath).then(function(data){
    let sample = data.sample;
    console.log(sample);
});

function info(sample){
    d3.json(jsonpath).then((data)=>{
        let metadata = data.metadata;
        let big_metadata = metadata.filter(sampleObj => sampleObj.id == sample);
        let result = big_metadata[0];
        let panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6")
            .text(`${key}: ${value}`);
          });
    })
}

function barchart(sample){
    d3.json(jsonpath).then((data)=>{
        let samples = data.samples;
        let big_samples = samples.filter(sampleObj => sampleObj.id == sample);
        let OTU = big_samples[0];
        let trace1 = {
            x: OTU.sample_values,
            y: OTU.otu_ids,
            text: OTU.otu_labels,
            type: "bar",
            name: "top bacterias found",
            orientation: "h",
        };
        let chartdata = [trace1];
        let layout = {
            title: "Top Bacteria Found",
            xaxis: {title: "Sample Value"},
            yaxis: {title: "OTU ID"},
        }
        Plotly.newPlot("bar", chartdata, layout);
    })
}

function bubblechart(sample){
    d3.json(jsonpath).then((data)=>{
        let samples = data.samples;
        let big_samples = samples.filter(sampleObj => sampleObj.id == sample);
        let OTU = big_samples[0];
        let trace2 = {
            y: OTU.sample_values,
            x: OTU.otu_ids,
            text: OTU.otu_labels,
            mode: "markers",
            marker: {
                size: OTU.sample_values,
                color: OTU.otu_ids,
                colorscale: "Picnic",
            }
        }
        let bubbledata = [trace2];
        let layout = {
            title: "Bacteria per Sample",
            xaxis: {title: "OTU ID"},
            yaxis: {title: "OTU Sample Volumes"},
        }
        Plotly.newPlot("bubble",bubbledata,layout)
    })
}

function deploy(){
    let selector = d3.select("#selDataset");
    d3.json(jsonpath).then((data) => {
        let samplenames = data.names;
    
        samplenames.forEach((sample) => {
            selector.append("option")
                    .text(sample)
                    .property("value", sample);
            });
        let firstSample = samplenames[0];
        info(firstSample);
        barchart(firstSample);
        bubblechart(firstSample);
        });
}

function optionChanged(sample2){
    info(sample2);
    barchart(sample2);
    bubblechart(sample2);
}

deploy();