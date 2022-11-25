// Load the require modules
var dust = require('../node_modules/dustjs-linkedin');
var fs = require('fs');

dust.helper = require('../node_modules/dustjs-helpers');

// Load the rendered template
fs.readFile('docs/api.dust.js', function(err, data) {
    // Throw any errors
    if(err) {
        throw err;
    }

    // Load the rendered template into dust
    dust.loadSource(data);

    // Load the data
    fs.readFile('docs/data.json', function(err, rawJSON) {
        // Throw any errors
        if(err) {
            throw err;
        }

        // Parse the JSON
        var raw = JSON.parse(rawJSON);

        // Build the data array
        var data = [];

        // Loop over all JSDoc block
        for(var i = 0; i < raw.length; i += 1) {
            if (!raw[i].isPrivate && !raw[i].ignore) {
                data.push(raw[i]);
            }
        }

        // Pipe the data into the template
        dust.render('api', data, function(err, out) {
            // Throw any errors
            if(err) {
                throw err;
            }

            // Write the data to the output
            fs.writeFile('docs/api.md', out);
        });
    });
});