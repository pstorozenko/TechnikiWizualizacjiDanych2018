!(function (d3) {

$("ccontent").empty();

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x0 = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x0)
    .tickSize(0)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var color = d3.scale.category20c()

var svg = d3.select('ccontent').append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data2.json", function(error, data) {

  var distansNames = data.map(function(d) { return d.distan; });
  var schoolNames = data[0].values.map(function(d) { return d.school; });

  x0.domain(distansNames);
  x1.domain(schoolNames).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(distan) { return d3.max(distan.values, function(d) { return d.value; }); })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("transform", "rotate(0)")
      .attr("x", width)
      .attr("dy", "2em")
      .style("text-anchor", "end")
      .style('font-weight','bold')
      .text("Odległość w drzewie do najblższego pracownika szkoły lwowskiej lub warszawskiej (w liczbie węzłów)");

  svg.append("g")
      .attr("class", "y axis")
      .style('opacity','0')
      .call(yAxis)
  .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style('font-weight','bold')
      .text("Liczba pracowników");

  svg.append("g")
      .attr("class", "x axis")
      .style('opacity','0')
      .call(xAxis);

  svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

  var slice = svg.selectAll(".slice")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform",function(d) { return "translate(" + x0(d.distan) + ",0)"; });

  slice.selectAll("rect")
      .data(function(d) { return d.values; })
  .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.school); })
      .style("fill", function(d) { return color(d.school) })
      .attr("y", function(d) { return y(0); })
      .attr("height", function(d) { return height - y(0); })
      .on("mouseover", function(d) {
          d3.select(this).style("fill", d3.rgb(color(d.school)).darker(2));
      })
      .on("mouseout", function(d) {
          d3.select(this).style("fill", color(d.school));
      });

  slice.selectAll("rect")
      .transition()
      .delay(function (d) {return Math.random()*1000;})
      .duration(1000)
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

  var legend = svg.selectAll(".legend")
      .data(data[0].values.map(function(d) { return d.school; }).reverse())
  .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
      .style("opacity","0");

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d); });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {return d; });

  legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

});

})(d3);