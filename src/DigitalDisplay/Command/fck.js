'use strict'

let one = require("./svetovodmatrix3x9.js");
let two = require("./svetovodmatrix16x32.js");

let out = "./svetovodmatrix.json";
let fs = require('bluebird')
	.promisifyAll(require('fs'));

let letters = {
	"A": "А",
	"B": "Б",
	"V": "В",
	"G": "Г",
	"D": "Д",
	"E": "Е",
	"EO": "Ё",
	"J": "Ж",
	"Z": "З",
	"I": "И",
	"II": "Й",
	"K": "К",
	"L": "Л",
	"M": "М",
	"N": "Н",
	"O": "О",
	"P": "П",
	"R": "Р",
	"S": "С",
	"T": "Т",
	"U": "У",
	"F": "Ф",
	"H": "Х",
	"C": "Ц",
	"CH": "Ч",
	"SH": "Ш",
	"SCH": "Щ",
	"SOFT": "Ь",
	"bl": "Ы",
	"HARD": "Ъ",
	"EE": "Э",
	"UU": "Ю",
	"JA": "Я",
	"space": " ",
	"dash": "-"
};

let keys = _.mapValues(one.font, (val, key) => {
	return _.last(_.split(key, '_'));
});

keys = _.mapValues(keys, (val) => {
	return letters[val] || val;
})
module.exports = fck();

function fck() {
	let data = {
		"24x9": _.pick(one, ["width", "height", "font"]),
		"32x16": _.pick(two, ["width", "height", "font"])
	};
	data = _.mapValues(data, (d) => {
		d.font = _.reduce(d.font, (acc, dd, key) => {
			acc[keys[key]] = _.toUpper(_.join(_.map(_.flattenDeep(dd), t => {
				return new Buffer([t])
					.toString('hex')
			}), ' '));
			return acc;
		}, {})
		return d;
	});
	console.log("DATA", data);
	return fs.writeFileAsync(out, JSON.stringify(data, null, 4));
}
