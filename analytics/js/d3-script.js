$(function(){
	var speedometer = function(){

		var margin = { top: 20, right: 0, bottom: 0, left: 0 },
		  width = 960 - margin.left - margin.right,
          height = 480 - margin.top - margin.bottom;

		var svg = d3.select("#speedometer")
                .append("svg")
                .attr("class", "speedometer-background")
                .attr("width",  width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

        var gauge = iopctrl.arcslider()
                .radius(120)
                .events(false)
                .indicator(iopctrl.defaultGaugeIndicator);

        gauge.axis().orient("in")
                .normalize(true)
                .ticks(12)
                .tickSubdivide(3)
                .tickSize(10, 8, 10)
                .tickPadding(5)
                .scale(d3.scale.linear()
                        .domain([0, 160])
                        .range([-3*Math.PI/4, 3*Math.PI/4]));

        var segDisplay = iopctrl.segdisplay()
                .width(80)
                .digitCount(6)
                .negative(false)
                .decimals(0);

        svg.append("g")
                .attr("class", "segdisplay")
                .attr("transform", "translate(150, 225)")
                .call(segDisplay);

        svg.append("g")
                .attr("class", "gauge")
                .attr("transform", "translate(25, 25)")
                .call(gauge);

        segDisplay.value(56749);
        gauge.value(92);
	}

	var dayhourmap = function(){
		var margin = { top: 20, right: 0, bottom: 50, left: 20 },
		  width = 960 - margin.left - margin.right,
          height = 480 - margin.top - margin.bottom,
		  gridSize = Math.floor(width / 24),
		  legendElementWidth = gridSize*2,
		  buckets = 9,
		  colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
		  days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
		  times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
		  datasets = ["hourmap-1.tsv"];


		var svg = d3.select("#day-hour-heat-map").append("svg")
		  .attr("id", "dayhour-responsive")
		  .attr("viewBox", "0 0 960 500")
		  .attr("preserveAspectRatio", "xMidYMid")
		  .attr("width", width + margin.left + margin.right)
		  .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var dayLabels = svg.selectAll(".dayLabel")
		  .data(days)
		  .enter().append("text")
		    .text(function (d) { return d; })
		    .attr("x", 0)
		    .attr("y", function (d, i) { return i * gridSize; })
		    .style("text-anchor", "end")
		    .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
		    .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

		var timeLabels = svg.selectAll(".timeLabel")
		  .data(times)
		  .enter().append("text")
		    .text(function(d) { return d; })
		    .attr("x", function(d, i) { return i * gridSize; })
		    .attr("y", 0)
		    .style("text-anchor", "middle")
		    .attr("transform", "translate(" + gridSize / 2 + ", -6)")
		    .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

		 var heatmapChart = function(tsvFile) {
		    d3.tsv(tsvFile,
		    function(d) {
		      return {
		        day: +d.day,
		        hour: +d.hour,
		        value: +d.value
		      };
		    },
		    function(error, data) {
		      var colorScale = d3.scale.quantile()
		          .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
		          .range(colors);

		      var cards = svg.selectAll(".hour")
		          .data(data, function(d) {return d.day+':'+d.hour;});

		      cards.append("title");

		      cards.enter().append("rect")
		          .attr("x", function(d) { return (d.hour - 1) * gridSize; })
		          .attr("y", function(d) { return (d.day - 1) * gridSize; })
		          .attr("rx", 4)
		          .attr("ry", 4)
		          .attr("class", "hour bordered")
		          .attr("width", gridSize)
		          .attr("height", gridSize)
		          .style("fill", colors[0]);

		      cards.transition().duration(1000)
		          .style("fill", function(d) { return colorScale(d.value); });

		      cards.select("title").text(function(d) { return d.value; });
		      
		      cards.exit().remove();

		      var legend = svg.selectAll(".legend")
		          .data([0].concat(colorScale.quantiles()), function(d) { return d; });

		      legend.enter().append("g")
		          .attr("class", "legend");

		      legend.append("rect")
		        .attr("x", function(d, i) { return legendElementWidth * i; })
		        .attr("y", height)
		        .attr("width", legendElementWidth)
		        .attr("height", gridSize / 2)
		        .style("fill", function(d, i) { return colors[i]; });

		      legend.append("text")
		        .attr("class", "mono")
		        .text(function(d) { return "≥ " + Math.round(d); })
		        .attr("x", function(d, i) { return legendElementWidth * i; })
		        .attr("y", height + gridSize);

		      legend.exit().remove();

		    });  
		  };

	  heatmapChart(datasets[0]);
	}

	var bubblechart = function(){
		var diameter = 800,
		    format = d3.format(",d"),
		    color = d3.scale.category20c();

		var bubble = d3.layout.pack()
		    .sort(null)
		    .size([diameter, diameter])
		    .padding(1.5);

		var width = 750,
            height = 550;

		var svg = d3.select("#bubble-chart").append("svg")
			.attr("id", "bubble-chart-responsive")
		  	.attr("viewBox", "0 0 800 800")
		 	.attr("preserveAspectRatio", "xMidYMid")
		    .attr("width", width)
		    .attr("height", height)
		    .attr("class", "bubble");

		d3.json("flare.json", function(error, root) {
		  if (error) throw error;

		  var node = svg.selectAll(".node")
		      .data(bubble.nodes(classes(root))
		      .filter(function(d) { return !d.children; }))
		    .enter().append("g")
		      .attr("class", "node")
		      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

		  node.append("title")
		      .text(function(d) { return d.className + ": " + format(d.value); });

		  node.append("circle")
		      .attr("r", function(d) { return d.r; })
		      .style("fill", function(d) { return color(d.packageName); });

		  node.append("text")
		      .attr("dy", ".3em")
		      .style("text-anchor", "middle")
		      .text(function(d) { return d.className.substring(0, d.r / 3); });
		});

		// Returns a flattened hierarchy containing all leaf nodes under the root.
		function classes(root) {
		  var classes = [];

		  function recurse(name, node) {
		    if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
		    else classes.push({packageName: name, className: node.name, value: node.size});
		  }

		  recurse(null, root);
		  return {children: classes};
		}

		d3.select(self.frameElement).style("height", diameter + "px");
	}

	var wordCloud = function(){
		var frequency_list = [{"text":"study","size":40},{"text":"motion","size":15},{"text":"forces","size":10},{"text":"electricity","size":15},{"text":"movement","size":10},{"text":"relation","size":5},{"text":"things","size":10},{"text":"force","size":5},{"text":"ad","size":5},{"text":"energy","size":85},{"text":"living","size":5},{"text":"nonliving","size":5},{"text":"laws","size":15},{"text":"speed","size":45},{"text":"velocity","size":30},{"text":"define","size":5},{"text":"constraints","size":5},{"text":"universe","size":10},{"text":"physics","size":120},{"text":"describing","size":5},{"text":"matter","size":90},{"text":"physics-the","size":5},{"text":"world","size":10},{"text":"works","size":10},{"text":"science","size":70},{"text":"interactions","size":30},{"text":"studies","size":5},{"text":"properties","size":45},{"text":"nature","size":40},{"text":"branch","size":30},{"text":"concerned","size":25},{"text":"source","size":40},{"text":"google","size":10},{"text":"defintions","size":5},{"text":"two","size":15},{"text":"grouped","size":15}];

	    var fill = d3.scale.category20();

	    var layout = d3.layout.cloud()
	        .size([750, 550])
	        .words(frequency_list)
	        .padding(5)
	        //.rotate(function() { return ~~(Math.random() * 2) * 90; })
	        .font("Impact")
	        .fontSize(function(d) { return d.size; })
	        .on("end", draw);

	    layout.start();

	    function draw(words) {
	      d3.select("#word-cloud").append("svg")
	      	.attr("id", "word-cloud-responsive")
		  	.attr("viewBox", "0 0 750 550")
		 	.attr("preserveAspectRatio", "xMidYMid")
	          .attr("width", layout.size()[0])
	          .attr("height", layout.size()[1])
	        .append("g")
	          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
	        .selectAll("text")
	          .data(words)
	        .enter().append("text")
	          .style("font-size", function(d) { return d.size + "px"; })
	          .style("font-family", "Impact")
	          .style("fill", function(d, i) { return fill(i); })
	          .attr("text-anchor", "middle")
	          .attr("transform", function(d) {
	            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
	          })
	          .text(function(d) { return d.text; });
	    }
	}

	//speedometer();
	dayhourmap();
	bubblechart();
	//wordCloud();

	var dayhourViewbox = 960 / 500,
	bubbleChartViewbox = 750/550,
	wordCloudViewBox =  750/550,
	dayHourChartSelector = $("#dayhour-responsive"),
	bubbleChartSelector = $("#bubble-chart-responsive"),
	wordCloudSelector = $("#word-cloud-responsive");

	var targetWidth = dayHourChartSelector.parent().width();
    var targetWidth1 = bubbleChartSelector.parent().width();
    var targetWidth2 = wordCloudSelector.parent().width();

    dayHourChartSelector.attr("width", targetWidth);
    bubbleChartSelector.attr("width", targetWidth1);
    wordCloudSelector.attr("width", targetWidth2);

    dayHourChartSelector.attr("height", targetWidth / dayhourViewbox);
    bubbleChartSelector.attr("height", targetWidth1 / bubbleChartViewbox);
    wordCloudSelector.attr("height", targetWidth2 / wordCloudViewBox);


	$(window).on("resize", function() {  
	    targetWidth = dayHourChartSelector.parent().width();
	    targetWidth1 = bubbleChartSelector.parent().width();
	    targetWidth2 = wordCloudSelector.parent().width();

	    dayHourChartSelector.attr("width", targetWidth);
	    bubbleChartSelector.attr("width", targetWidth1);
	    wordCloudSelector.attr("width", targetWidth2);

	    dayHourChartSelector.attr("height", targetWidth / dayhourViewbox);
	    bubbleChartSelector.attr("height", targetWidth1 / bubbleChartViewbox);
	    wordCloudSelector.attr("height", targetWidth2 / wordCloudViewBox);
	});

});

