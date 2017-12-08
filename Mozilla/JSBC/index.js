
// Set of URL used for testing. Each URL got loaded between ~30 times for each
// configuration.  The following results correspond to the result obtained with
// the apptelemetry addon [1], which measures the time between the navigation
// start and the onload event start, which only corresponds to a smaller set of
// things optimized by the JSBC, which captures until the idle time of the
// browser.
//
// https://en.wikipedia.org/wiki/John_Fox_(American_football)
// https://www.google.fr/search?q=firefox
// https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=firefox+dummies
// https://twitter.com/webincompat
// https://www.facebook.com/  (logged in)
//
// [1] https://addons.mozilla.org/en-US/firefox/addon/apptelemetry/
//
var data = [
    // Without JSBC
    { q1: 370, q2: 380, q3: 390, mean: 381.2},          // wikipedia
    { q1: 850, q2: 870, q3: 910, mean: 887.2},          // google
    { q1: 1175, q2: 1200, q3: 1250, mean: 1226.13},     // twitter
    { q1: 1240, q2: 1300, q3: 1335, mean: 1320},        // amazon
    { q1: 1902.5, q2: 1980, q3: 2072.5, mean: 2030.88}, // facebook

    // With JSBC
    { q1: 340, q2: 350, q3: 357.5, mean: 351.36},     // wikipedia
    { q1: 790, q2: 830, q3: 880, mean: 844},          // google   
    { q1: 1102.5, q2: 1125, q3: 1187.5, mean: 1160},  // twitter  
    { q1: 1140, q2: 1230, q3: 1332.5, mean: 1255.56}, // amazon   
    { q1: 1670, q2: 1790, q3: 1910, mean: 1787.44},   // facebook 
];

var chart = c3.generate({
    size: {
        width: document.body.clientWidth - 20,
        height: document.body.clientHeight - 20,
    },
    data: {
        columns: [
            // wikipedia, google, twitter, amazon, facebook
            ['Without JSBC', ...(data.slice(0,5).map(x => x.mean))],
            ['With JSBC', ...(data.slice(5,10).map(x => x.mean))],
        ],
        type: 'bar'
    },
    axis: {
        rotated: true,
        x: {
            type: 'category',
            categories: ['Wikipedia', 'Google Search Result', 'Twitter', 'Amazon', 'Facebook Timeline'],
            tick: { multiline: true },
        },
        y: {
            label: "Time (ms)",
            // tick: {
            //    format: function (d) { return d + " ms"; }
            //},
            max: 1990,
        }
    },
    grid: {
        y: {
            show: true
        }
    },
    legend: { item: { onclick: function(id) {} } },
    onresized: function () {
        updateErrorBars(); // need to be fixed..
    }
});

var errorBars = d3.select('#chart svg .c3-chart').append('g');

errorBars.selectAll('circle')
    .data(data)
    .enter().append('circle')
    .attr('class', function (d, i) { return 'error-circle-' + i; })
    .attr('r', 5);

errorBars.selectAll('path')
    .data(data)
    .enter().append('path')
    .attr('class', function (d, i) { return 'error-line-' + i; });

function updateErrorBars() {

    d3.selectAll('.c3-bar').each(function (d, i) {
        console.log(this.pathSegList);
        var segList = this.pathSegList,
            xPos = segList[1].x,
            yPos = (segList[2].y - segList[1].y) / 2 + segList[1].y;

        errorBars.select('.error-circle-' + i)
            .attr('cx', d => xPos / d.mean * d.q2)
            .attr('cy', yPos);

        errorBars.select('.error-line-' + i)
            .attr('d', function (d) {
                var h = 8;
                var xq1 = xPos / d.mean * d.q1;
                var xq3 = xPos / d.mean * d.q3;
                // Line between q1 and q3.
                return 'M' + xq1 + ',' + yPos + ' ' +
                    'L' + xq3 + ',' + yPos + ' ' +
                    // Q1 line
                    'M' + xq1 + ',' + (yPos - h) + ' ' +
                    'L' + xq1 + ',' + (yPos + h) + ' ' +
                    // Q3 line
                    'M' + xq3 + ',' + (yPos - h) + ' ' +
                    'L' + xq3 + ',' + (yPos + h) + ' ' +
                    'z';
            });

    });
};

setTimeout(updateErrorBars, 500);

// Resize the chart at most at 15fps.
(function() {
  window.addEventListener("resize", resizeThrottler, false);

  var resizeTimeout;
  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        actualResizeHandler();
       // The actualResizeHandler will execute at a rate of 15fps
       }, 66);
    }
  }

  function actualResizeHandler() {
    // handle the resize event
    chart.resize({
      width: document.body.clientWidth - 20,
      height: document.body.clientHeight - 20
    })
  }
}());
