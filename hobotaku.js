var h1 = document.getElementById('h1');
var headerLabel = document.getElementById('headerLabel');
var footerLabel = document.getElementById('footerLabel');
var inputLabel = document.getElementById('inputLabel');
var ac = false;
var op = '';
var value = 0;
var base = 0;
var ans = [];
var ix = 0;

function reset_var() {
  ac = true;
  op = '';
}

function pushBtn(obj) {
	var pushed = obj.innerHTML;
	pushBtn_(pushed);
}

function pushBtn_(pushed) {
	var val = inputLabel.innerHTML;
	
	if (pushed == 'AC') {
		// 全てクリア
		headerLabel.innerHTML = '';
		footerLabel.innerHTML = '';
		inputLabel.innerHTML = '0';
		reset_var();
	} else if (pushed == 'BackSpace') {
		if (ac) {
			pushBtn_('AC');
		} else {
			inputLabel.innerHTML = inputLabel.innerHTML.slice(0, -1);
			if (inputLabel.innerHTML == '') 
				inputLabel.innerHTML = '0';
		}
	} else if (pushed == '←' || pushed == '→') {
		if (pushed == '←') goPrev();
		else goNext();
	
	} else if (pushed == '√') {
		headerLabel.innerHTML = '√' + val;
		val = frac2float(val);
		value = nRound(Math.sqrt(val), 7);
		execApprox();
		reset_var();
	} else if (pushed == 'sin' || pushed == 'cos' || pushed == 'tan') {
		headerLabel.innerHTML = pushed + '(' + val + '&deg;)';
		val = frac2float(val);
		if (pushed == 'sin') value = Math.sin(rad(val));
		else if (pushed == 'cos') value = Math.cos(rad(val));
		else if (pushed == 'tan') value = Math.tan(rad(val));
		value = nRound(value, 7);
		execApprox();
		reset_var();
	} else if (pushed == 'log') {
		if (val == 0) headerLabel.innerHTML = 'Error: Not defined';
		else if (val < 1) headerLabel.innerHTML = 'Error: Negative value';
		else {
			headerLabel.innerHTML = 'log(' + val + ')';
			val = frac2float(val);
			value = nRound(Math.log10(val), 7);
			execApprox();
			reset_var();
		}
	} else if (pushed == '^' || pushed == '+' || pushed == '-' || pushed == '×' || pushed == '÷') {
		if (op == '') { 
			headerLabel.innerHTML = val;
			val = frac2float(val);
			value = val;
			inputLabel.innerHTML = '0';
		}
		op = pushed;
	} else if (pushed == '=') {
		if (ac) headerLabel.innerHTML = val;
		else headerLabel.innerHTML += op + val;
		val = frac2float(val);
		if (op == '^') { 
			value = nRound(Math.pow(value, val), 7);
		} else if (op == '+') { 
			value = nRound(Number(value) + Number(val), 7);
		} else if (op == '-') { 
			value = nRound(Number(value) - Number(val), 7);
		} else if (op == '×') { 
			value = nRound(value * val, 7);
		} else if (op == '÷') { 
			value = nRound(value / val, 7);
		} else { 
			value = nRound(val, 7);
		}
		execApprox();
		reset_var();
	
	} else if (pushed == '.') {
		if (ac) inputLabel.innerHTML = '0.';
		else if (inputLabel.innerHTML.indexOf('.') == -1) inputLabel.innerHTML += pushed;
		ac = false;
	} else {
		if (ac || inputLabel.innerHTML == '0') {
			if (op == '') headerLabel.innerHTML = '';
			footerLabel.innerHTML = '';
			inputLabel.innerHTML = pushed;
			ac = false;
		} else {
			if (inputLabel.innerHTML.length < 10) 
				inputLabel.innerHTML += pushed;
		}
	}
}

function execApprox() {
	if (isNaN(value)) return;
	base = 0;
	while (value != 0 && value < 0.1) {
		value *= 10;
		base += 1;
	}
	xi = Math.floor(value);
	xf = value - xi;
	error_max = 0.05;
	
	ans = [];
	for (b=1; b<=30; b++) {
		af =  Math.round(xf * b); // 近似値の小数部分 || xf ~ af/b
		error = Math.abs(1 - (xi + af / b) / value);
		if (error < error_max) {
			a = xi * b + af;
			ans.push([a,b]);
			error_max = error;
		}
	}
	ix = 0;
	if (h1.innerHTML == '電卓')
		headerLabel.innerHTML += ' = ' + nRound(value / Math.pow(10, base), 7);
	show_ans();
} 

function show_ans() {
	a = ans[ix][0];
	b = ans[ix][1];
	factor = nRound(100 * value / (a / b) - 100, 2);
	strError = ' ( ';
	if (factor > 0) {
		strError += '-' + factor;
	} else if (factor < 0) {
		strError += '+' + Math.abs(factor);	
	} else {
		strError += '±0';
	}
	strError += '% )';
	b *= Math.pow(10, base);
	g = gcd(a, b);
	a /= g;
	b /= g;

	inputLabel.innerHTML = a;
	if (b > 1) inputLabel.innerHTML += '/' + b;	
	footerLabel.innerHTML = strError; // '= ' + nRound(a / b, 7) + strError;
}

function nRound(value, base) {
	return Math.round(value * Math.pow(10, base)) / Math.pow(10, base);
}

function rad(value) {
	return value * Math.PI / 180;
}

function frac2float(value) {
	if (value == 'e') return 2.71828182;
	else if (value == 'π') return 3.14159265;
	val = value.split('/');
	if (val.length == 1) return value;
	else return val[0] / val[1];
}

function gcd(a, b) {
	if (b === 0){
		return a;
	}
	return gcd(b, a % b);
}

function goPrev() {
	if (ix == 0) return;
	ix -= 1;
	show_ans();
}

function goNext() {
	if (ix == ans.length - 1) return;
	ix += 1;
	show_ans();
}

function toggle() {
	if (h1.innerHTML == '電卓') h1.innerHTML = 'ほぼ電卓';
	else h1.innerHTML = '電卓';
}

document.onkeydown = function(e) {
	var keyCode = false;
 
	if (e) event = e;
 
	if (event) {
		if (event.keyCode) {
			keyCode = event.keyCode;
		} else if (event.which) {
			keyCode = event.which;
		}
	}
	keyCodeTable = {
	  8:'BackSpace',13:'=',37:'←',39:'→',
	  48:0,49:1,50:2,51:3,52:4,53:5,54:6,55:7,56:8,57:9,
	  96:0,97:1,98:2,99:3,100:4,101:5,102:6,103:7,104:8,105:9,
	  106:'×',107:'+',109:'-',110:'.',111:'÷',
	  160:'^',173:'-',190:'.',191:'÷'
	};
 
	if (keyCodeTable[keyCode]) {
		pushBtn_(keyCodeTable[keyCode]);
	}
};
