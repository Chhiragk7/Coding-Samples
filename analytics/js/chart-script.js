$(function(){
    Chart.defaults.global.responsive = true;
    var myDoughnutChart;
    // var strESURL =  "http://143.91.240.186:9200/endecasearch-2015/cdr/_search";
    // var steHttpMethod = "POST";
    // var TopCountSize = 30;
    // var objDataOut;
    // var datain = { "query": { "filtered": { "query": { "query_string": { "query": "*", "analyze_wildcard": true } }, "filter": { "bool": { "must": [{ "query": { "query_string": { "analyze_wildcard": true, "query": "*" } } }], "must_not": [] } } } }, "size": 0, "aggs": { "Searchwords": { "terms": { "field": "Searchword", "exclude": { "pattern": "i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall" }, "size": TopCountSize, "order": { "_count": "desc" } } } } }

    //     $.ajax({
    //         url: strESURL,
    //         type: steHttpMethod,
    //         contentType: 'application/json; charset=UTF-8',
    //         crossDomain: true,
    //         dataType: 'json',
    //         data: JSON.stringify(datain),
    //         success: function (response) {

    //             objDataOut = response.aggregations.Searchwords.buckets;
    //             console.log(objDataOut);
    //             if (objDataOut != null) objDataOut = JSON.stringify(objDataOut);
    //         },
    //         error: function (jqXHR, textStatus, errorThrown) {
    //             var jso = jQuery.parseJSON(jqXHR.responseText);
    //             alert('error (' + jqXHR.status + ') ' + errorThrown + ' --<br />' + jso.error);

    //         }
    //     });
    
            //call function here    
         //   json_creator("chat.txt");
        /***********************************/


        /************** Function to generate JSON file from txt file *********/
        $.ajax({
            url : "chat.txt",
            dataType: "text",
            success : function (data) {
                var result = [];
                var employeeRecord = [];
                var chatDriversRecord = [];
                var totalHitString = data.split('\n')[0];
                var totalHitCount = totalHitString.split("---").pop();
                //Function to call for total chat hit count
                feedTotalHitCount(totalHitCount);

                var lines = data.split('\n');
                lines.splice(0,1);
                var header = lines[0].split("||@");
                for(var i=1; i<lines.length; i++){
                    var obj = {};
                    var currentline=lines[i].split("||@");
                    for(var j=0;j<header.length;j++){
                        obj[header[j]] = currentline[j];
                    }
                    result.push(obj);
                }  

                var fetchedData = [];
                fetchedData = JSON.parse(JSON.stringify(result));
                getAjaxData(fetchedData);

                //Function call to find chat Sale/Service
                salesServiceRecord = JSON.parse(JSON.stringify(result));
                chatSaleService(salesServiceRecord);
            }
        });
     /************************************************************/
     
    /* Total chat hit count */
    function feedTotalHitCount(totalHitCount){
        var totalHitCountSelector = document.getElementById("total-hit-count");
        totalHitCountSelector.innerHTML = totalHitCount;
        $("#total-hit-spinner").hide();
    }
    /* Total chat hit count end here */

    /* Sale Service Doughnut */
    function chatSaleService(salesServiceRecord){
        var serviceFlagCounter =0;
        var salesFlagCounter=0;
        var onlyServiceData = [];
        var onlySaleData = [];

        for(var i=0; i<salesServiceRecord.length; i++){
            if(salesServiceRecord[i].SALE_SERVICE_FLAG == "SERVICE"){
                serviceFlagCounter++;
                onlyServiceData.push(salesServiceRecord[i]);
            }
            else if(salesServiceRecord[i].SALE_SERVICE_FLAG == "SALES"){
                salesFlagCounter++;
                onlySaleData.push(salesServiceRecord[i]);
            }
            else{ 
            } 
        }
        salesServiceDoughnut(serviceFlagCounter, salesFlagCounter);
        getOnlyChatServiceData(onlyServiceData, serviceFlagCounter);
        getOnlyChatSaleData(onlySaleData, salesFlagCounter);
    }

    function salesServiceDoughnut(serviceFlagCounter, salesFlagCounter){
        var salesServiceData = [
            {
                value: serviceFlagCounter,
                color:"#F7464A",
                highlight: "#FF5A5E",
                label: "Service"
            },
            {
                value: salesFlagCounter,
                color: "#46BFBD",
                highlight: "#5AD3D1",
                label: "Sales"
            }
        ]
        var doughnutChart = document.getElementById("doughnut-chart").getContext("2d");
        myDoughnutChart = new Chart(doughnutChart).Doughnut(salesServiceData,"");
        //getChatSaleServiceDoughnut(myDoughnutChart);
        $("#sale-service-doughnut").hide();
    }
    /* Sale Service Doughnut End here */

    /* fetchedData function */
    function getAjaxData(fetchedData){
        topTenEmployee(fetchedData);
        topTenChatDriver(fetchedData);
        topTenCityName(fetchedData);
    }
    
    function parsedemployeeResult(fetchedData){
        var contentArray = [];
        for(var i=0; i<fetchedData.length; i++){
            contentArray.push(fetchedData[i].REP_NAME);
        }
        return contentArray;
    }

    function parsedChatDriverResult(fetchedData){
        var contentArray = [];
        for(var i=0; i<fetchedData.length; i++){
            contentArray.push(fetchedData[i].KEY_DRIVER_ANSWER);
        }
        return contentArray;
    }


    function parsedCityResult(fetchedData){
        var contentArray = [];
        for(var i=0; i<fetchedData.length; i++){ 
            contentArray.push(fetchedData[i].CITY);
        }
        return contentArray;
    }


    function findTopTen(contentArray){
        if(contentArray.length == 0){
            return 0;
        }
        var contentCounts = {};
        var contentTopTen = [];
        for(var i = 0; i< contentArray.length; i++) {
            var num = contentArray[i];
            contentCounts[num] = contentCounts[num] ? contentCounts[num]+1 : 1;
        }

        var sortable = [];
        for (var content in contentCounts)
              sortable.push([content, contentCounts[content]])
        sortable.sort(function(a, b) {return b[1] - a[1]});

        for(var i=0; i<10; i++){
           contentTopTen.push(sortable[i]); 
        } 
        return contentTopTen;
    }
    var counter = 0;
    function removeUndefinedProperties(contentArray){
        var removedUndefinedData = [];
        removedUndefinedData = $.grep(contentArray,function(n){ return(n) });
        // for(var i = 0; i<contentArray.length;i++){
        //     for(var j=0; j<contentArray.length;j++){
        //        if(contentArray[j] == "" || contentArray[j] == "undfined" || contentArray[j] == null){
        //             contentArray.splice(j, 1);
        //         } 
        //     } 
        // } 
        //console.log(arr);
        return removedUndefinedData;
    }

    /* Top 10 Employee */
    var topTenEmployeeChart;
    function topTenEmployee(fetchedData){
        var employeeNames = [];
        employeeNames = parsedemployeeResult(fetchedData);
        topTenEmployee = findTopTen(employeeNames);
        feedData(topTenEmployee);
    }

    function feedData(topEmployee){
        for(var i=0; i<topEmployee.length; i++){
            var j = i+1;
            $("#top-employees-legend").append("(" + j + ")" +"&nbsp;" + topEmployee[i][0]+"&nbsp;");
        }
        var topEmployeeData = {
            // labels: [topEmployee[0][0], topEmployee[1][0], topEmployee[2][0], topEmployee[3][0], topEmployee[4][0], topEmployee[5][0],
            // topEmployee[6][0], topEmployee[7][0], topEmployee[8][0], topEmployee[9][0]],
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,0.8)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: [topEmployee[0][1], topEmployee[1][1],topEmployee[2][1], topEmployee[3][1], topEmployee[4][1],topEmployee[5][1], 
                    topEmployee[6][1], topEmployee[7][1],topEmployee[8][1], topEmployee[9][1]]
                },          
            ]
        };
        var barChart1 = document.getElementById("bar-chart-1").getContext("2d");
        topTenEmployeeChart = new Chart(barChart1).Bar(topEmployeeData, "");
        $("#barchart1").hide();
    }
    /*Top 10 employee ends here */

    /* Chat Drivers */
    function topTenChatDriver(fetchedData){
        var keyDriverNames = [];
        keyDriverNames = parsedChatDriverResult(fetchedData);
        var withoutEmptyChatContent = [];
        withoutEmptyChatContent = removeUndefinedProperties(keyDriverNames);
        var topTenChatName = [];
        topTenChatName = findTopTen(withoutEmptyChatContent);

        feedChatDriversData(topTenChatName);
    }

    var topTenChatDriverChart;
    var j=0;
    function feedChatDriversData(topChatDrivers){
        for(var i=0; i<topChatDrivers.length; i++){
          
            var topChatDriversWithoutSemiColon = topChatDrivers[i][0].toString().substr(2, topChatDrivers[i][0].length-4);
            j++;
            $("#top-chart-driver-legend").append("(" + j + ")" +"&nbsp;" + topChatDriversWithoutSemiColon+"&nbsp;");

        }
        var topChatDriversData = {
            labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            datasets: [
                {
                    label: "My First dataset",
                    fillColor: "rgba(151,187,205,0.5)",
                    strokeColor: "rgba(151,187,205,0.8)",
                    highlightFill: "rgba(151,187,205,0.75)",
                    highlightStroke: "rgba(151,187,205,1)",
                    data: [topChatDrivers[0][1], topChatDrivers[1][1],topChatDrivers[2][1], topChatDrivers[3][1],topChatDrivers[4][1],
                    topChatDrivers[5][1], topChatDrivers[6][1],topChatDrivers[7][1], topChatDrivers[8][1],topChatDrivers[9][1]]
                },          
            ]
        };

        var barChart2 = document.getElementById("bar-chart-2").getContext("2d");
        topTenChatDriverChart = new Chart(barChart2).Bar(topChatDriversData, "");
        $("#barchart2").hide();
    }
    /* Ends here */

    /* Word Cloud Function */
    function topTenCityName(fetchedData){
        var cityNames = [];
        cityNames = parsedCityResult(fetchedData);

        var withoutEmptyCityName = [];
        withoutEmptyCityName = removeUndefinedProperties(cityNames);

        var topTenCityName = [];
        topTenCityName = findTopTen(withoutEmptyCityName);
        wordCloudCityFeedData(topTenCityName);
    }

    var wordCloudCityFeedData = function(topTenCityName){
        
        var topTenCities = topTenCityName;
        var fill = d3.scale.category20();
        var scaleFontSize = d3.scale.linear().range([10,60]);
        
        scaleFontSize.domain([
                d3.min(topTenCities, function(d){ return d[1];}),
                d3.max(topTenCities, function(d){ return d[1];})
            ]);
        
        var layout = d3.layout.cloud()
            .size([750, 550])
            .words(topTenCities)
            .padding(5)
            //.rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) { return scaleFontSize(d[1]); })
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
              .style("font-size", function(d) { return scaleFontSize(d[1]) + "px"; })
              .style("font-family", "Impact")
              .style("fill", function(d, i) { return fill(i); })
              .attr("text-anchor", "middle")
              .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
              })
              .text(function(d) { return d[0]; });
        }
        $("#word-cloud-spinner").hide();
    }

    /* UPDATE BAR GRAPHS */ 

    function getOnlyChatServiceData(onlyServiceData, serviceFlagCounter){
        //Top 10 Service Employee Name
        var serviceEmployeeNames = [];
        serviceEmployeeNames = parsedemployeeResult(onlyServiceData);
        var topTenServiceEmployee=[];
        topTenServiceEmployee = findTopTen(serviceEmployeeNames);

        //Top 10 Service Chat Drivers
        var serviceChatDrivers = [];
        serviceChatDrivers = parsedChatDriverResult(onlyServiceData);

        var serviceChatDriversWithoutEmptyEntries = [];
        serviceChatDriversWithoutEmptyEntries = removeUndefinedProperties(serviceChatDrivers);

        var topTenChatDriver = [];
        topTenChatDriver = findTopTen(serviceChatDriversWithoutEmptyEntries);

        //Top 10 Service City Names
        var serviceCityNames = [];
        serviceCityNames = parsedCityResult(onlyServiceData);

        var cityNamesWithoutEmptyEntries = [];
        cityNamesWithoutEmptyEntries = removeUndefinedProperties(serviceCityNames);

        var topTenServiceCities=[];
        topTenServiceCities = findTopTen(cityNamesWithoutEmptyEntries);

        updateTopTenServiceEmployee(topTenServiceEmployee, topTenChatDriver, serviceFlagCounter, topTenServiceCities);
    }

    function updateTopTenServiceEmployee(topTenServiceEmployee, topTenChatDriver, serviceFlagCounter, topTenServiceCities){
        /* on click event, change graph data */ 
        $("#doughnut-chart").click(function(evt) {

            var activePoints = myDoughnutChart.getSegmentsAtEvent(evt);
            var activeLabel = activePoints[0].label;

            if(activeLabel == "Service"){
                $("#top-employees-legend").empty();
                $("#top-chart-driver-legend").empty();

                myDoughnutChart.removeData(1); // 1 for sales doughnut
                for(var i=0; i<topTenServiceEmployee.length;i++){
                    var j = i+1;
                    $("#top-employees-legend").append("(" + j + ")&nbsp;"+ topTenServiceEmployee[i][0]);

                    topTenEmployeeChart.datasets[0].bars[i].value = topTenServiceEmployee[i][1];
                }
                topTenEmployeeChart.update();
                

                for(var i=0; i<topTenChatDriver.length;i++){
                    var topTenChatDriverWithoutSemiColon = topTenChatDriver[i][0].toString().substr(2, topTenChatDriver[i][0].length-4);
                    var j = i+1;
                    $("#top-chart-driver-legend").append("(" + j + ")&nbsp;"+ topTenChatDriverWithoutSemiColon);
                    topTenChatDriverChart.datasets[0].bars[i].value = topTenChatDriver[i][1];
                }
                topTenChatDriverChart.update();

                //Update Word Cloud
                d3.select("#word-cloud svg").remove();
                wordCloudCityFeedData(topTenServiceCities);

                //Update hit counter
                $("#total-hit-count").fadeOut('slow', function(){
                    $("#total-hit-count").fadeIn('slow').html(serviceFlagCounter);
                }); 
            }
        });
    }

    function getOnlyChatSaleData(onlySaleData, salesFlagCounter){
        //Top 10 Sales Employee Name
        var saleEmployeeNames = [];
        saleEmployeeNames = parsedemployeeResult(onlySaleData);

        var topTenSaleEmployee=[];
        topTenSaleEmployee = findTopTen(saleEmployeeNames);

        //Top 10 Sale Chat Driver
        var saleChatDrivers = [];   
        saleChatDrivers = parsedChatDriverResult(onlySaleData);

        var saleChatDriversWithoutEmptyEntries = [];
        saleChatDriversWithoutEmptyEntries = removeUndefinedProperties(saleChatDrivers);

        var topTenSaleChatDriver = [];
        topTenSaleChatDriver = findTopTen(saleChatDriversWithoutEmptyEntries);

        //Top 10 Sale City Names
        var saleCityNames = [];
        saleCityNames = parsedCityResult(onlySaleData);

        var cityNamesWithoutEmptyEntries = [];
        cityNamesWithoutEmptyEntries = removeUndefinedProperties(saleCityNames);

        var topTenSaleCities=[];
        topTenSaleCities = findTopTen(cityNamesWithoutEmptyEntries);
            
        updateTopTenSaleEmployee(topTenSaleEmployee, topTenSaleChatDriver, salesFlagCounter, topTenSaleCities);
    }
    

    function updateTopTenSaleEmployee(topTenSaleEmployee, topTenSaleChatDriver, salesFlagCounter, topTenSaleCities){
        /* on click event, change graph data */ 
        $("#doughnut-chart").click(function(evt) {
            var activePoints = myDoughnutChart.getSegmentsAtEvent(evt);
            var activeLabel = activePoints[0].label;
            if(activeLabel == "Sales"){

                $("#top-employees-legend").empty();
                //$("#top-chart-driver-legend").empty();

                myDoughnutChart.removeData(0); // 0 for service doughnut
                for(var i=0; i<topTenSaleEmployee.length;i++){
                    var j = i+1;
                    $("#top-employees-legend").append("(" + j + ")&nbsp;"+ topTenSaleEmployee[i][0]);
                    topTenEmployeeChart.datasets[0].bars[i].value = topTenSaleEmployee[i][1];
                }
                topTenEmployeeChart.update();
                
                if(!topTenSaleChatDriver == 0){
                    for(var i=0; i<topTenSaleChatDriver.length;i++){
                        var topTenChatDriverWithoutSemiColon = topTenSaleChatDriver[i][0].toString().substr(2, topTenSaleChatDriver[i][0].length-4);
                        var j = i+1;
                        $("#top-chart-driver-legend").append("(" + j + ")&nbsp;"+ topTenChatDriverWithoutSemiColon);
                        topTenChatDriverChart.datasets[0].bars[i].value = topTenSaleChatDriver[i][1];
                    }
                    topTenChatDriverChart.update();
                }
                
                else{
                    for(var i=0; i<10;i++){
                        $("#top-chart-driver-legend").empty();
                        $("#top-chart-driver-legend").append("NOTHING TO DISPLAY");
                        topTenChatDriverChart.datasets[0].bars[i].value = 0;
                    }
                    topTenChatDriverChart.update();
                }

                //Update Word Cloud
                d3.select("#word-cloud svg").remove();
                wordCloudCityFeedData(topTenSaleCities);

                //Update hit counter
                $("#total-hit-count").fadeOut('slow', function(){
                    $("#total-hit-count").fadeIn('slow').html(salesFlagCounter);
                });              
            }
        });
    }

	//Line Chart
	var overallData = {
        labels: ["asdsa", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: [23, 59, 80, 81, 56, 55, 40]
            },          
        ]
    };

    //Line chart generation 
    var lineChart = document.getElementById("line-chart").getContext("2d");
    var myLineChart = new Chart(lineChart).Line(overallData, "");
   
});

/* Load updated data on graph if clicked */
var updateLineChartData = function(lineChart, updateData, options){
    window.lineChart.destroy();
    lineChart = new Chart(lineChart).Line(updateData, options);
    lineChartRandomColor(lineChart, updateData);
}

var updateBarChartData = function(barChart, updateData, options){
    for(var i=0; i<barChart.length; i++){
        barChart[i].destroy();
        barChart[i] = new Chart(barChart[i]).Bar(updateData, options);
        barChartRandomColor(barChart[i], updateData);
    }
}

/* Generate random colors for line graph */
var lineChartRandomColor = function(chartSelector, data){
    for(var i=0; i<data.datasets[0].data.length; i++){
        chartSelector.datasets[0].fillColor = randomColor({ luminosity: 'random', hue: 'random' });  
    }
    chartSelector.update();
}

/* Generate random colors for bar graph */
var barChartRandomColor = function(chartSelector, data){
    for(var i=0; i<data.datasets[0].data.length; i++){
        chartSelector.datasets[0].bars[i].fillColor = randomColor({ luminosity: 'random', hue: 'random' });  
    }
    chartSelector.update();
}