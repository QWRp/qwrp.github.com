var traceToHTML = (function () {
    "use strict";

    function buildEnvironment(env) {
        return JSON.stringify(env).replace(/"/g, "'");
    }

    function makeValueString(value) {
        if (Array.isArray(value)) {
            var string = "(";

            for(var i = 0; i < value.length; i++) {
                string += makeValueString(value[i]) + " ";
            }

            string = string.substr(0, string.length - 1) + ")";
            return string;
        } else if (typeof value == 'boolean') {
            return (value) ? '#t' : '#f';
        } else {
            return "" + value;
        }
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

    function stringifyTrace(trace) {
        trace.value_string = makeValueString(trace.value);
        if (Array.isArray(trace.expr)) {
            if (trace.expr[0] === 'quote') {
                trace.string = "'";
                if(trace.value_string[0] === '(') {
                    trace.string += trace.value_string;
                } else {
                    trace.string += "(" + trace.value_string + ")";
                }
            }
            else {
                var result = '(' + trace.expr[0];

                for (var i = 0; i < trace.children.length; i++) {
                    stringifyTrace(trace.children[i]);
                    result += ' ' + trace.children[i].string;
                }

                trace.string = result + ')';
            }
        } else if (typeof trace.expr === 'boolean') {
            trace.string = '' + (trace.value === true) ? '#t' : '#f';
        } else {
            trace.string = '' + trace.expr;
        }
    }

    function traceToHTML(trace) {
        stringifyTrace(trace);
        return processElement(trace);
    }

    return traceToHTML;
}());