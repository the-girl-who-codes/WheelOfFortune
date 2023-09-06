const colors = [
	'#F8AF2A',
	'#ED6B31',
	'#F0516D',
	'#7559BC',
	'#244CA4',
	'#273247',
	'#85CEE2',
	'#7EC9A9',
	'#778FC5',
	'#F59099'
];


const addMoreButton = document.getElementById("addMoreNames");
const nameInputsContainer = document.getElementById("nameInputs");
const rand = (m, M) => Math.random() * (M - m) + m;
const spinEl = document.querySelector('#spin');
const ctx = document.querySelector('#wheel').getContext('2d');
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;

const friction = 0.991;
let angVel = 0;
let ang = 0;
let currentVisibleInputs = 3;


addMoreButton.addEventListener('click', function () {
	if (currentVisibleInputs < 10) {
		const color = colors[currentVisibleInputs];
		const li = document.createElement("li");
		
		const checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		checkbox.checked = false;
		
		const colorBox = document.createElement("div");
		colorBox.className = "color-box";
		colorBox.style.backgroundColor = color;
		
		checkbox.addEventListener('change', drawWheel);
		
		const input = document.createElement("input");
		input.type = "text";
		input.className = "name-input";
		input.placeholder = `Name ${currentVisibleInputs + 1}`;
		
		input.addEventListener('input', function () {
			const checkbox = this.previousSibling.previousSibling;
			checkbox.checked = this.value.trim() !== "";
			drawWheel();
		});
		
		li.appendChild(checkbox);
		li.appendChild(colorBox);
		li.appendChild(input);
		nameInputsContainer.appendChild(li);
		
		currentVisibleInputs++;
		
		if (currentVisibleInputs === 10) {
			addMoreButton.style.display = "none";
		}
	}
});

nameInputsContainer.after(addMoreButton);

colors.slice(0, currentVisibleInputs).forEach((color, index) => {
	const li = document.createElement("li");
	
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = false;
	
	const colorBox = document.createElement("div");
	colorBox.className = "color-box";
	colorBox.style.backgroundColor = color;
	
	checkbox.addEventListener('change', drawWheel);
	
	const input = document.createElement("input");
	input.type = "text";
	input.className = "name-input";
	input.placeholder = `Name ${index + 1}`;
	
	input.addEventListener('input', function () {
		const checkbox = this.previousSibling.previousSibling;
		checkbox.checked = this.value.trim() !== "";
		drawWheel();
	});
	
	li.appendChild(checkbox);
	li.appendChild(colorBox);
	li.appendChild(input);
	nameInputsContainer.appendChild(li);
});

function getSectorsFromInputs() {
	const sectors = [];
	const inputs = document.querySelectorAll(".name-input");
	inputs.forEach((input, index) => {
		const checkbox = input.previousSibling.previousSibling;
		if (checkbox.checked && input.value.trim() !== "") {
			sectors.push({color: colors[index], label: input.value});
		}
	});
	return sectors;
}

function getIndex(sectors) {
	const tot = sectors.length;
	const index = Math.floor(tot - (ang / TAU) * tot) % tot;
	return Math.max(0, Math.min(index, tot - 1));
}

function drawWheel() {
	ctx.clearRect(0, 0, dia, dia);
	
	const sectors = getSectorsFromInputs();
	const arc = TAU / sectors.length;
	sectors.forEach((sector, i) => drawSector(sector, i, arc));
	rotate();
}

function drawSector(sector, i, arc) {
	const ang = arc * i
	ctx.save()
	// COLOR
	ctx.beginPath()
	ctx.fillStyle = sector.color
	ctx.moveTo(rad, rad)
	ctx.arc(rad, rad, rad, ang, ang + arc)
	ctx.lineTo(rad, rad)
	ctx.fill()
	// TEXT
	ctx.translate(rad, rad)
	ctx.rotate(ang + arc / 2)
	ctx.textAlign = 'right'
	ctx.fillStyle = '#fff'
	ctx.font = 'bold 20px sans-serif'
	ctx.fillText(sector.label, rad - 10, 10)
	//
	ctx.restore()
}

function rotate() {
	const sectors = getSectorsFromInputs();
	if (sectors.length === 0) {
		spinEl.style.background = '#ffffff';
		spinEl.style.boxShadow = 'none'
		return;
	}
	
	const sector = sectors[getIndex(sectors)];
	ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
	spinEl.style.background = sector.color;
	spinEl.style.boxShadow = '0 0 0 8px currentColor, 0 0 15px 5px rgba(0, 0, 0, 0.6)';
}

function frame() {
	if (!angVel) return
	angVel *= friction;
	if (angVel < 0.002) angVel = 0;
	ang += angVel;
	ang %= TAU;
	rotate()
}

function engine() {
	frame()
	requestAnimationFrame(engine)
}

function init() {
	drawWheel();
	engine();
	
	spinEl.addEventListener('click', () => {
		if (!angVel) angVel = rand(0.25, 0.45);
	});
}

init()
