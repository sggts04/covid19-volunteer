let mongoose = require('mongoose');

let volunteerSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	age: {
		type: Number,
		required: true
	},
	state: {
		type: String,
		required: true
	},
    skills: {
        type: String,
		required: true
    },
    medical: {
        type: Boolean,
		required: true
	},
	email: {
        type: String,
		required: true
	},
	phone: {
        type: Number,
		required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

let Volunteer = module.exports = mongoose.model('Volunteer', volunteerSchema);