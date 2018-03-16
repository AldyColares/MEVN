const mongoose = require('mongoose'),

    employerSchema = mongoose.Schema({
        name: {
            type: String,
            required: [true, 'name required']
        },
        lastName: {
            type: String,
            required: [true, 'last name required']
        },
        percetegens: {
            type: Number,
            required: [true, 'percentage required'],
            validate: { 
                validator: function(v) {
                if (v < 0){ return false}
                return true;
            },
            message: 'the {VALUE} can not be negative.'
            }
        }
    });
    employerSchema.pre('save', function(done) {
        // the cheking of percetegens. if > 100% or the sum whole percetegens more new percetegens 
        // is more that 100%. 
        let employer = this;
        if(employer.percetegens > 100){
            let err = new Error("the valor percetegens must be 100% or minor");
            err.status = 404;
            done(err);
        }
        done();
    });
const Employer = mongoose.model('employer', employerSchema);
module.exports = Employer;