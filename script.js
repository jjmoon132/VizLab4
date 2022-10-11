let weatlthHealth;
d3.csv(
	'wealth-health-2014.csv', d3.autoType).then(data=>{
		weatlthHealth = data;

	// chart creation
	let margin = {top:25, right:25,left:25,bottom:25};
	let outHeight = 500;
	let outWidth = 960;
	let width = outWidth - margin.left - margin.right,
		height = outHeight - margin.top - margin.bottom;

	const svg = d3.select('.chart').append('svg')
		.attr("width", outWidth)
		.attr("height", outHeight);

	const g = svg.append("g")
    	.attr("transform", `translate(${margin.left}, ${margin.right})`);

	let iMin = d3.min(weatlthHealth,d=>d.Income)
		iMax = d3.max(weatlthHealth,d=>d.Income)
		lMin = d3.min(weatlthHealth,d=>d.LifeExpectancy)
		lMax = d3.max(weatlthHealth,d=>d.LifeExpectancy);

	const incomeScale = d3.scaleLinear()
		.domain([iMin-2000, iMax+2000])
		.range([0,width]);
	const lifeScale = d3.scaleLinear()
		.domain([lMin-1, lMax+1])
		.range([height,0]);
	const unique = [...new Set(weatlthHealth.map(d => d.Region))];

	const colorScale = d3.scaleOrdinal(d3.schemeTableau10)
		.domain(unique);

	const xAxis = d3.axisBottom()
		.scale(incomeScale)
		.ticks(5, "s");
	const yAxis = d3.axisLeft()
		.scale(lifeScale)
		.ticks(5, "s");

	//tooltip creation
/*	let tooltip = d3.select("g")
		.append("div")
		.style("position","fixed")
		.style("z-index", "10")
		.style("display", "block")
		.text("a simple tooltip"); */

	g.selectAll("circle")
		.data(weatlthHealth)
		.enter()
		.append("circle")
		.attr("cy",d=>lifeScale(d.LifeExpectancy))
		.attr("cx",d=>incomeScale(d.Income))
		.attr("r",(d,i)=>{if (d.Population < 10000000) {return 5;
						} else if (d.Population < 500000000){
							return 10;
						} else if(d.Population < 10000000000){
							return 15;
						} else{
							return 25;
						}})
		.attr("fill",d=>colorScale(d.Region))
		.attr("stroke","black")
		.attr("opacity","0.5")
		.on("mouseenter", function(event, d) {
			//Get this bar's x/y values
			const pos = d3.pointer(event, window); // pos = [x,y]
			//Update the tooltip position and value
			d3.select(".tooltip")
				.data(weatlthHealth)
				.style("position","fixed")
				.style("left", pos[0]+"px")
				.style("top", pos[1]+"px")
				//console.log(d.Country)
				.html(`<p>Country: ${d.Country} <br>
						Region: ${d.Region} <br>
						Population: ${d3.format(",")(d.Population)}<br>
						Income: ${d3.format(",")(d.Income)} <br>
						Life Expectancy: ${d.LifeExpectancy}</p>
				 		`);
			//Show the tooltip
			d3.select(".tooltip").style("display", "block");
		  })
		  .on("mouseleave", function(event, d) {
			//Hide the tooltip
			d3.select(".tooltip").style("display","none");
		  });

	g.append("g")
		.attr("class", "axis x-axis")
		.call(xAxis)
		.attr("transform", `translate(0, ${height})`);

	g.append("g")
		.attr("class", "axis y-axis")
		.call(yAxis);

	svg.append("text")
		.attr('x', width/2)
		.attr('y', height+20)
		.text("Income");
	
	svg.append("text")
		.attr("class","yTitle")
		.attr('x', 40)
		.attr('y', 50)
		.text("Life Expectancy");

	//legend 
	console.log(unique);
	let lwidth = 250,
		lheight = 300;
	const svg2 = svg.append("svg")
		.attr("width", lwidth)
		.attr("height", lheight)
		.attr("x",outWidth - 250)
		.attr("y",outHeight - 150);
	svg2.selectAll("rect")
		.data(unique)
		.enter()
		.append("rect")
		.attr("x",20)
		.attr("y",(_,i)=>i*15)
		.attr("width",12)
		.attr("height",12)
		.attr("fill",d=>colorScale(d));
	svg2.selectAll("text")
		  .data(unique)
		  .enter()
		  .append("text")
		  .attr("x",35)
		  .attr("y",(_,i)=>(i*15)+11)
		  .text(d=>d);
	});