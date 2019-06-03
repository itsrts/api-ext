"use strict";
let AJV         = require('ajv');
let L           = require('./logger');

function schemaValidator() {
    this.ajv            = new AJV({ coerceTypes: true });
    this.ajv.addKeyword("range", {
        type: ["number", "integer"],
        compile: function(sch, parentSchema) {
            var min = sch[0];
            var max = sch[1];

            return parentSchema.exclusiveRange === true
                    ? function (data) { return data > min && data < max; }
                    : function (data) { return data >= min && data <= max; };
        }
    });
}

schemaValidator.prototype.validate = function(data, schema) {

    let result = this.ajv.validate(schema, data);

    if(!result) {
        let message = this.ajv.errorsText().replace(/'/g, "").replace("data ", "");
        L.log('the error message is->' + message);
        // change message if it is a pattern faliure
        if(message.indexOf('should match pattern') > 0) {
            message = 'Invalid Input';
        }
        return {valid : false, error : message};
    } else {
        return {valid : true, error : "No errors"};
    }
}

module.exports = new schemaValidator();