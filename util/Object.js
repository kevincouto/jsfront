
define("jsf.util.Object", {
    _static: {
        mergeDefaultOptions: function(options, defaultOptions) {
            var i, o = {};

            for (i in defaultOptions) {
                o[i] = options[i] != undefined ? options[i] : defaultOptions[i];
            }

            return o;
        }
    }
});
