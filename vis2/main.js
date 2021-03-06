//  render slopegraph chart

(function() {
    'use strict';

    var data,
        // keys values from data to be applied
        keyValues = ['1 Mostly True', '2 Mixed', '3 Mostly False'];

    // store chart
    var slopegraph;
    // track any user interactions
    var state = {
        // have an array to mutate
        keys: keyValues,
        // track filtered sets
        filter: [],
        // toggle highlights
        navToggle: [],
        // track line selection
        highlight: null
    };

    d3.json('vis2/data.json', function(error, json) {
        if (error) throw error;
        // access data outside this callback
        data = json;
        // initial render chart
        render(data, keyValues);
        // alternative navigation     
        navAlt(data);
        // add some filter options
        filterFunc();
    });

    // filter sets via user interaction
    function filterFunc() {
        // create array values
        _.times(keyValues.length, function(n) {
            state.filter.push(true);
        });

        d3.select('#filter').append('ul')
            .selectAll('li')
            .data(keyValues)
            .enter().append('li')
            .on('click', function (d, i) {
                if (!state.filter[i]) {
                    // set toggle 
                    state.filter[i] = true;
                    d3.select(this).style('opacity', 1);
                    // push key into array
                    state.keys.push(d);
                    // ensure array is kept in date order
                    state.keys = _.sortBy(state.keys);
                    // render chart with new keys
                    render(data, state.keys);
                // ensure there at least two values
                // so a slopegraph can be rendered
                } else if (state.filter[i] && state.keys.length > 2) {
                    state.filter[i] = false;
                    d3.select(this).style('opacity', 0.3);
                    _.pull(state.keys, d);
                    state.keys = _.sortBy(state.keys);
                    render(data, state.keys);
                }
            })
            .text(function (d) { return d; });
    }

    // navigation to highlight lines
    function navAlt(data) {
        // create array values
        _.times(data.length, function(n) {
            state.navToggle.push(true);
        });

        d3.select('#nav-alt').append('ul')
            .selectAll('li')
            .data(data)
            .enter().append('li')
            .attr('class', function (d, i) { return 'navAlt li-' + i; })
            .on('click', function (d, i) {
                if (!state.navToggle[i]) {
                    // update toggle state
                    state.navToggle[i] = true;
                    resetSelection();
                    state.highlight = null;
                } else if (state.navToggle[i]) {
                    state.navToggle[i] = false;
                    // hover to highlight line
                    highlightLine(i);
                    // highlight nav in relation to line
                    highlightNav(i);
                    // update state
                    state.highlight = i;
                }
            })
            .text(function (d) { return d['country']; });
    }


    // render slopegraph chart 
    function render(data, keys) {
        resetSelection();
        // create chart
        slopegraph = d3.eesur.slopegraph_v2()
            .margin({top: 20, bottom: 20, left: 100, right: 100})
            .gutter(25)
            .keyName('country')
            .keyValues(keys)
            .on('_hover', function (d, i) {
                // hover to highlight line
                highlightLine(i);
                // highlight nav in relation to line
                highlightNav(i);
                // update state of selected highlight line
                state.highlight = i;
            });


        // apply chart
        d3.select('#slopegraph')
            .datum(data)
            .call(slopegraph);

        // ensure highlight is maintained on update    
        if (!_.isNull(state.highlight)) {
            d3.selectAll('.elm').style('opacity', 0.2);
            d3.selectAll('.sel-' + state.highlight).style('opacity', 1);
            highlightNav(state.highlight);
        }
    }

    function highlightLine(i) {
        d3.selectAll('.elm').transition().style('opacity', 0.2);
        d3.selectAll('.sel-' + i).transition().style('opacity', 1);
    }

    function highlightNav(i) {
        d3.selectAll('.navAlt').transition().style('opacity', 0.6);
        d3.select('.li-' + i).transition().style('opacity', 1);
    }

    function resetSelection() {
        d3.selectAll('.elm').transition().style('opacity', 1);
        d3.selectAll('.navAlt').transition().style('opacity', 1);
    }

    // just for blocks viewer size
    d3.select(self.frameElement).style('height', '800px');

}());