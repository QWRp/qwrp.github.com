var traceToHTML = (function () {
    "use strict";

    function buildEnvironment(env) {
        return JSON.stringify(env).replace(/"/g, "'");
    }

    function processElement(trace, noexpr) {
        if (noexpr !== true && Array.isArray(trace.expr)) {
            if (trace.expr[0] === 'quote') {
                var result = '<span class="scheem-expr scheem-popover" data-title="' + trace.string + '" data-content="Value: ' + trace.value_string + " Environment: " + buildEnvironment(trace.env) +"\">'</span>";
                var data = trace.value_string;

                console.log(data);
                if (data[0] !== '(') {
                    data = "(" + data + ")";
                }

                return result + data;
            }
            else {
                var result = '(<span class="scheem-expr scheem-popover" data-title="' + trace.string + '" data-content="Value: ' + trace.value_string + ' Environment: '+ buildEnvironment(trace.env) +'">' + trace.expr[0] + '</span>';

                for (var i = 0; i < trace.children.length; i++) {
                    result += ' ' + processElement(trace.children[i]);
                }

                return result + ')';
            }
        } else if (typeof trace.expr === 'string') {
            if (trace.value !== null) {
                return '<span class="scheem-variable scheem-popover" data-title="Variable \'' + trace.string + '\'" data-content="Value: ' + trace.value_string + '">' + trace.expr + '</span>';
            } else {
                return '<span class="scheem-identifier">' + trace.expr + '</span>';
            }
        } else if (typeof trace.expr === 'boolean') {
            return '<span class="scheem-boolean">' + ((trace.value === true) ? '#t' : '#f') + '</span>';
        } else {
            return '<span class="scheem-number">' + trace.expr + '</span>';
        }
    }

    function traceToHTML(trace) {
        return processElement(trace);
    }

    return traceToHTML;
}());