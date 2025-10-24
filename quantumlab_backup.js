// Dados dos elementos com configurações eletrônicas detalhadas
const ELEMENT_DATA = {
	1: { 
		symbol: "H", 
		name: "Hidrogênio", 
		group: "nonmetal", 
		atomicMass: 1.008, 
		atomicNumber: 1, 
		electronConfiguration: "1s¹", 
		electronegativity: 2.20, 
		meltingPoint: -259, 
		boilingPoint: -253,
		electrons: 1,
		protons: 1,
		neutrons: 0,
		electronShells: [1],
		energyLevels: [13.6],
		magneticMoment: 1
	},
	2: { 
		symbol: "He", 
		name: "Hélio", 
		group: "noble-gas", 
		atomicMass: 4.0026, 
		atomicNumber: 2, 
		electronConfiguration: "1s²", 
		electronegativity: null, 
		meltingPoint: -272, 
		boilingPoint: -269,
		electrons: 2,
		protons: 2,
		neutrons: 2,
		electronShells: [2],
		energyLevels: [24.6, 54.4],
		magneticMoment: 0
	},
	3: { 
		symbol: "Li", 
		name: "Lítio", 
		group: "alkali-metal", 
		atomicMass: 6.94, 
		atomicNumber: 3, 
		electronConfiguration: "[He] 2s¹", 
		electronegativity: 0.98, 
		meltingPoint: 181, 
		boilingPoint: 1342,
		electrons: 3,
		protons: 3,
		neutrons: 4,
		electronShells: [2, 1],
		energyLevels: [5.39, 75.6, 122.5],
		magneticMoment: 1
	},
	6: { 
		symbol: "C", 
		name: "Carbono", 
		group: "nonmetal", 
		atomicMass: 12.011, 
		atomicNumber: 6, 
		electronConfiguration: "[He] 2s² 2p²", 
		electronegativity: 2.55, 
		meltingPoint: 3550, 
		boilingPoint: 4027,
		electrons: 6,
		protons: 6,
		neutrons: 6,
		electronShells: [2, 4],
		energyLevels: [11.3, 24.4, 47.9, 64.5, 392.1, 490.0],
		magneticMoment: 2
	},
	8: { 
		symbol: "O", 
		name: "Oxigênio", 
		group: "nonmetal", 
		atomicMass: 15.999, 
		atomicNumber: 8, 
		electronConfiguration: "[He] 2s² 2p⁴", 
		electronegativity: 3.44, 
		meltingPoint: -219, 
		boilingPoint: -183,
		electrons: 8,
		protons: 8,
		neutrons: 8,
		electronShells: [2, 6],
		energyLevels: [13.6, 35.1, 54.9, 77.4, 113.9, 138.1],
		magneticMoment: 2
	},
	11: { 
		symbol: "Na", 
		name: "Sódio", 
		group: "alkali-metal", 
		atomicMass: 22.990, 
		atomicNumber: 11, 
		electronConfiguration: "[Ne] 3s¹", 
		electronegativity: 0.93, 
		meltingPoint: 98, 
		boilingPoint: 883,
		electrons: 11,
		protons: 11,
		neutrons: 12,
		electronShells: [2, 8, 1],
		energyLevels: [5.14, 47.3, 71.6, 98.9, 138.0, 172.0],
		magneticMoment: 1
	},
	26: { 
		symbol: "Fe", 
		name: "Ferro", 
		group: "transition-metal", 
		atomicMass: 55.845, 
		atomicNumber: 26, 
		electronConfiguration: "[Ar] 3d⁶ 4s²", 
		electronegativity: 1.83, 
		meltingPoint: 1538, 
		boilingPoint: 2862,
		electrons: 26,
		protons: 26,
		neutrons: 30,
		electronShells: [2, 8, 14, 2],
		energyLevels: [7.9, 16.2, 30.7, 54.9, 75.0, 99.0],
		magneticMoment: 4
	},
	79: { 
		symbol: "Au", 
		name: "Ouro", 
		group: "transition-metal", 
		atomicMass: 196.97, 
		atomicNumber: 79, 
		electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", 
		electronegativity: 2.54, 
		meltingPoint: 1064, 
		boilingPoint: 2856,
		electrons: 79,
		protons: 79,
		neutrons: 118,
		electronShells: [2, 8, 18, 32, 18, 1],
		energyLevels: [9.2, 20.5, 30.0, 99.0, 120.0, 150.0],
		magneticMoment: 1
	}
};

const GROUP_NAMES = {
	'alkali-metal': 'Metal Alcalino',
	'alkaline-earth': 'Metal Alcalino-Terroso',
	'transition-metal': 'Metal de Transição',
	'basic-metal': 'Outros Metais',
	'metalloid': 'Semimetal',
	'nonmetal': 'Não Metal',
	'halogen': 'Halogênio',
	'noble-gas': 'Gás Nobre',
	'lanthanide': 'Lantanídeo',
	'actinide': 'Actinídeo'
};

let currentElement = ELEMENT_DATA[1];
let currentTool = 'select-atom';
let animationId = null;
let isAnimating = true;
let excitedElectrons = new Set();
let photonCount = 0;
let currentEnergyLevel = 0;

// Variáveis do campo magnético
let magneticFieldStrength = 0;
let magneticFieldDirection = 'up';
let isMagneticFieldActive = false;
let zeemanSplitActive = false;

// Variáveis de temperatura
let currentTemperature = 25;
let isTemperatureApplied = false;
let thermalParticles = [];
let thermalAnimationId = null;

document.addEventListener('DOMContentLoaded', function() {
	// Configurar event listeners
	setupEventListeners();
	
	// Selecionar hidrogênio por padrão
	selectElement(1);
	
	// Iniciar animação
	startAnimation();
});

function setupEventListeners() {
	// Ferramentas da sidebar
	const toolItems = document.querySelectorAll('.tool-item');
	toolItems.forEach(item => {
		item.addEventListener('click', function() {
			const tool = this.getAttribute('data-tool');
			
			// Atualizar ferramentas ativas
			toolItems.forEach(i => i.classList.remove('active'));
			this.classList.add('active');
			
			// Executar ação da ferramenta
			handleToolSelection(tool);
		});
	});

	// Botão play/pause
	document.getElementById('play-pause-btn').addEventListener('click', function() {
		if (isAnimating) {
			stopAnimation();
			this.innerHTML = '▶️ Executar';
		} else {
			startAnimation();
			this.innerHTML = '⏸️ Pausar';
		}
		isAnimating = !isAnimating;
	});

	// Controles de energia
	document.getElementById('energy-slider').addEventListener('input', function() {
		const energy = parseFloat(this.value);
		document.getElementById('energy-value').textContent = energy.toFixed(1) + ' eV';
		currentEnergyLevel = energy;
	});

	document.getElementById('excite-btn').addEventListener('click', exciteElectrons);
	document.getElementById('reset-energy-btn').addEventListener('click', resetEnergy);

	// Controles magnéticos
	document.getElementById('magnetic-slider').addEventListener('input', function() {
		const strength = parseFloat(this.value);
		document.getElementById('magnetic-value').textContent = strength.toFixed(1) + ' T';
		magneticFieldStrength = strength;
	});

	document.getElementById('apply-magnetic-btn').addEventListener('click', applyMagneticField);
	document.getElementById('reset-magnetic-btn').addEventListener('click', resetMagneticField);

	// Direção do campo magnético
	document.querySelectorAll('.direction-btn').forEach(btn => {
		btn.addEventListener('click', function() {
			document.querySelectorAll('.direction-btn').forEach(b => b.classList.remove('active'));
			this.classList.add('active');
			magneticFieldDirection = this.getAttribute('data-direction');
		});
	});

	// Controles de temperatura
	document.getElementById('temperature-slider').addEventListener('input', function() {
		const temp = parseFloat(this.value);
		updateTemperatureDisplay(temp);
		currentTemperature = temp;
	});

	document.getElementById('apply-temperature-btn').addEventListener('click', applyTemperature);
	document.getElementById('reset-temperature-btn').addEventListener('click', resetTemperature);

	// Temperaturas predefinidas
	document.querySelectorAll('.preset-btn').forEach(btn => {
		btn.addEventListener('click', function() {
			const temp = parseFloat(this.getAttribute('data-temp'));
			const slider = document.getElementById('temperature-slider');
			slider.value = temp;
			
			// Atualiza UI do display
			updateTemperatureDisplay(temp);
			currentTemperature = temp;
			
			// Recalcula fatores térmicos para o loop de animação
			applyThermalParams();              // <<< IMPORTANTE
			
			// 2) Dispara 'input' do slider (garante qualquer listener adicional)
			slider.dispatchEvent(new Event('input', { bubbles: true }));
			
			// 3) Opcional: aplica efeitos visuais imediatamente
			isTemperatureApplied = true;
			applyTemperature();
		});
	});
}

function updateTemperatureDisplay(temperature) {
	const display = document.getElementById('temperature-value');
	display.textContent = temperature + '°C';
	
	// Atualizar classe baseada na temperatura
	display.className = 'temperature-value';
	if (temperature < 0) {
		display.classList.add('cold');
	} else if (temperature < 100) {
		display.classList.add('normal');
	} else if (temperature < 1000) {
		display.classList.add('hot');
	} else {
		display.classList.add('plasma');
	}
	
	document.getElementById('current-temperature').textContent = temperature + '°C';
}

function applyTemperature() {
	isTemperatureApplied = true;
	const element = currentElement;
	
	// Determinar estado físico baseado na temperatura
	let physicalState = '';
	let stateColor = '';
	
	if (currentTemperature < element.meltingPoint) {
		physicalState = 'Sólido';
		stateColor = 'var(--cold-blue)';
	} else if (currentTemperature < element.boilingPoint) {
		physicalState = 'Líquido';
		stateColor = 'var(--quantum-blue)';
	} else if (currentTemperature < 5000) {
		physicalState = 'Gasoso';
		stateColor = 'var(--hot-red)';
	} else {
		physicalState = 'Plasma';
		stateColor = 'var(--plasma-pink)';
	}
	
	// Atualizar displays
	document.getElementById('physical-state').textContent = physicalState;
	document.getElementById('element-state').textContent = physicalState;
	document.getElementById('thermal-energy').textContent = (currentTemperature * 0.0000862).toFixed(3) + ' eV';
	
	// Aplicar efeitos visuais
	const canvas = document.getElementById('atom-canvas');
	const nucleus = document.querySelector('.nucleus');
	const electrons = document.querySelectorAll('.electron');
	const orbits = document.querySelectorAll('.orbit');
	
	// Resetar classes
	canvas.className = 'atom-canvas';
	if (nucleus) nucleus.className = 'nucleus';
	
	// Aplicar classes baseadas na temperatura
	if (currentTemperature < 0) {
		canvas.classList.add('cold');
		if (nucleus) nucleus.classList.add('cold');
	} else if (currentTemperature > 1000) {
		canvas.classList.add('hot');
		if (nucleus) nucleus.classList.add('hot');
		electrons.forEach(e => e.classList.add('hot'));
		orbits.forEach(o => o.classList.add('hot'));
	}
	
	if (currentTemperature > 5000) {
		canvas.classList.add('plasma');
		if (nucleus) nucleus.classList.add('plasma');
		electrons.forEach(e => e.classList.add('plasma'));
	}
	
	// Iniciar partículas térmicas
	startThermalParticles();
	
	// Atualizar status
	document.getElementById('reaction-status').textContent = `🌡️ ${physicalState} - ${currentTemperature}°C`;
	document.getElementById('reaction-status').style.color = stateColor;
	
	// Atualize fatores do loop para refletir a nova temperatura
	applyThermalParams();                // <<< GARANTE CONSISTÊNCIA
}

function resetTemperature() {
	isTemperatureApplied = false;
	currentTemperature = 25;
	
	// Resetar controles
	document.getElementById('temperature-slider').value = 25;
	updateTemperatureDisplay(25);
	
	// Resetar efeitos visuais
	const canvas = document.getElementById('atom-canvas');
	const nucleus = document.querySelector('.nucleus');
	const electrons = document.querySelectorAll('.electron');
	const orbits = document.querySelectorAll('.orbit');
	
	canvas.className = 'atom-canvas';
	if (nucleus) nucleus.className = 'nucleus';
	electrons.forEach(e => {
		e.classList.remove('hot', 'plasma');
	});
	orbits.forEach(o => {
		o.classList.remove('hot');
	});
	
	// Parar partículas térmicas
	stopThermalParticles();
	
	// Resetar displays
	const state = currentElement.meltingPoint > 25 ? 'Sólido' : 
				 currentElement.boilingPoint < 25 ? 'Gasoso' : 'Líquido';
	document.getElementById('physical-state').textContent = state;
	document.getElementById('element-state').textContent = state;
	document.getElementById('thermal-energy').textContent = '0 eV';
	document.getElementById('reaction-status').textContent = '✅ Sistema estável';
	document.getElementById('reaction-status').style.color = 'var(--lab-white)';
}

function startThermalParticles() {
	stopThermalParticles();
	const container = document.getElementById('thermal-particles');
	
	function createParticles() {
		if (!isTemperatureApplied) return;
		
		// Número de partículas baseado na temperatura
		const particleCount = Math.min(50, Math.floor(currentTemperature / 100));
		
		for (let i = 0; i < particleCount; i++) {
			const particle = document.createElement('div');
			particle.className = 'thermal-particle';
			
			// Tamanho e cor baseados na temperatura
			const size = 2 + (Math.random() * 4);
			particle.style.width = size + 'px';
			particle.style.height = size + 'px';
			
			if (currentTemperature < 0) {
				particle.style.background = 'var(--cold-blue)';
				particle.style.boxShadow = '0 0 8px var(--cold-blue)';
			} else if (currentTemperature < 1000) {
				particle.style.background = 'var(--hot-red)';
				particle.style.boxShadow = '0 0 10px var(--hot-red)';
			} else {
				particle.style.background = 'var(--plasma-pink)';
				particle.style.boxShadow = '0 0 12px var(--plasma-pink)';
			}
			
			// Posição aleatória
			const x = Math.random() * 500;
			const y = Math.random() * 500;
			particle.style.left = x + 'px';
			particle.style.top = y + 'px';
			
			// Animação
			const duration = 1 + Math.random() * 2;
			const delay = Math.random() * 2;
			
			particle.style.animation = `
				thermal-float ${duration}s ease-in-out ${delay}s infinite
			`;
			
			container.appendChild(particle);
			
			// Remover após animação
			setTimeout(() => {
				if (particle.parentNode) {
					particle.parentNode.removeChild(particle);
				}
			}, (duration + delay) * 1000);
		}
		
		thermalAnimationId = requestAnimationFrame(createParticles);
	}
	
	// Adicionar keyframes dinamicamente
	const style = document.createElement('style');
	style.textContent = `
		@keyframes thermal-float {
			0% {
				transform: translate(0, 0) scale(1);
				opacity: 0;
			}
			50% {
				transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2);
				opacity: ${0.3 + Math.random() * 0.7};
			}
			100% {
				transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1);
				opacity: 0;
			}
		}
	`;
	document.head.appendChild(style);
	
	thermalAnimationId = requestAnimationFrame(createParticles);
}

function stopThermalParticles() {
	if (thermalAnimationId) {
		cancelAnimationFrame(thermalAnimationId);
		thermalAnimationId = null;
	}
	document.getElementById('thermal-particles').innerHTML = '';
}

function handleToolSelection(tool) {
	currentTool = tool;
	
	switch(tool) {
		case 'select-atom':
			document.getElementById('energy-panel').style.display = 'none';
			document.getElementById('magnetic-panel').style.display = 'none';
			document.getElementById('temperature-panel').style.display = 'none';
			document.getElementById('element-info').style.display = 'block';
			openPeriodicTable();
			break;
		case 'add-energy':
			document.getElementById('energy-panel').style.display = 'block';
			document.getElementById('magnetic-panel').style.display = 'none';
			document.getElementById('temperature-panel').style.display = 'none';
			document.getElementById('element-info').style.display = 'none';
			break;
		case 'magnetic-field':
			document.getElementById('energy-panel').style.display = 'none';
			document.getElementById('magnetic-panel').style.display = 'block';
			document.getElementById('temperature-panel').style.display = 'none';
			document.getElementById('element-info').style.display = 'none';
			break;
		case 'control-temperature':
			document.getElementById('energy-panel').style.display = 'none';
			document.getElementById('magnetic-panel').style.display = 'none';
			document.getElementById('temperature-panel').style.display = 'block';
			document.getElementById('element-info').style.display = 'none';
			break;
	}
}

function applyMagneticField() {
	if (magneticFieldStrength > 0) {
		isMagneticFieldActive = true;
		zeemanSplitActive = true;
		
		// Mostrar linhas de campo magnético
		document.getElementById('magnetic-field-lines').style.opacity = Math.min(0.6, magneticFieldStrength / 5);
		
		// Aplicar efeito Zeeman nas órbitas
		const orbits = document.querySelectorAll('.orbit');
		orbits.forEach(orbit => {
			orbit.classList.add('zeeman-split');
		});
		
		// Atualizar status
		document.getElementById('zeeman-effect').textContent = 'Ativo';
		document.getElementById('reaction-status').textContent = '🧲 Efeito Zeeman Ativo';
		document.getElementById('reaction-status').style.color = 'var(--magnetic-blue)';
		
		updateSpinAlignment();
	}
}

function resetMagneticField() {
	isMagneticFieldActive = false;
	zeemanSplitActive = false;
	magneticFieldStrength = 0;
	
	// Esconder linhas de campo
	document.getElementById('magnetic-field-lines').style.opacity = '0';
	
	// Remover efeitos visuais
	const orbits = document.querySelectorAll('.orbit');
	orbits.forEach(orbit => {
		orbit.classList.remove('zeeman-split');
	});
	
	const electrons = document.querySelectorAll('.electron');
	electrons.forEach(electron => {
		electron.classList.remove('spin-up', 'spin-down');
	});
	
	// Resetar controles
	document.getElementById('magnetic-slider').value = 0;
	document.getElementById('magnetic-value').textContent = '0.0 T';
	document.getElementById('zeeman-effect').textContent = 'Inativo';
	document.getElementById('spin-aligned').textContent = '0';
	document.getElementById('reaction-status').textContent = '✅ Sistema estável';
	document.getElementById('reaction-status').style.color = 'var(--lab-white)';
}

function updateSpinAlignment() {
	if (!isMagneticFieldActive) return;
	
	const electrons = document.querySelectorAll('.electron');
	let alignedCount = 0;
	
	electrons.forEach((electron, index) => {
		// Probabilidade de alinhamento baseada na força do campo
		const alignmentProbability = Math.min(0.8, magneticFieldStrength / 8);
		
		if (Math.random() < alignmentProbability) {
			// Determinar spin baseado na direção do campo
			if (magneticFieldDirection === 'up') {
				electron.classList.add('spin-up');
				electron.classList.remove('spin-down');
			} else {
				electron.classList.add('spin-down');
				electron.classList.remove('spin-up');
			}
			alignedCount++;
		}
	});
	
	document.getElementById('spin-aligned').textContent = alignedCount;
}

function exciteElectrons() {
	const electrons = document.querySelectorAll('.electron');
	const energy = currentEnergyLevel;
	
	// Resetar elétrons excitados anteriores
	excitedElectrons.clear();
	
	electrons.forEach((electron, index) => {
		// Chance de excitação baseada na energia
		const excitationChance = Math.min(0.8, energy / 20);
		
		if (Math.random() < excitationChance) {
			excitedElectrons.add(electron);
			electron.classList.add('excited');
			
			// Aumentar temporariamente o raio da órbita (salto quântico)
			const currentRadius = parseFloat(electron.dataset.orbitRadius);
			electron.dataset.excitedRadius = currentRadius * 1.5;
			electron.dataset.originalRadius = currentRadius;
			electron.dataset.excitationTime = Date.now();
			
			// Atualizar contador
			document.getElementById('excited-count').textContent = excitedElectrons.size;
			
			// Atualizar status
			document.getElementById('reaction-status').textContent = '⚡ Elétrons excitados!';
			document.getElementById('reaction-status').style.color = 'var(--radioactive-green)';
		}
	});
	
	if (excitedElectrons.size === 0) {
		document.getElementById('reaction-status').textContent = '❌ Energia insuficiente';
		document.getElementById('reaction-status').style.color = 'var(--danger-red)';
	}
}

function resetEnergy() {
	// Resetar todos os elétrons
	const electrons = document.querySelectorAll('.electron');
	electrons.forEach(electron => {
		electron.classList.remove('excited');
		if (electron.dataset.originalRadius) {
			electron.dataset.orbitRadius = electron.dataset.originalRadius;
		}
	});
	
	excitedElectrons.clear();
	document.getElementById('excited-count').textContent = '0';
	document.getElementById('reaction-status').textContent = '✅ Sistema estável';
	document.getElementById('reaction-status').style.color = 'var(--lab-white)';
}

function emitPhoton(x, y) {
	const photon = document.createElement('div');
	photon.className = 'photon';
	photon.style.left = x + 'px';
	photon.style.top = y + 'px';
	photon.style.animation = 'photon-emission 1s ease-out forwards';
	
	document.getElementById('atom-display').appendChild(photon);
	
	// Atualizar contador
	photonCount++;
	document.getElementById('photon-count').textContent = photonCount;
	
	// Remover após animação
	setTimeout(() => {
		photon.remove();
	}, 1000);
}

function openPeriodicTable() {
	const modal = document.getElementById('periodic-table-modal');
	const table = document.getElementById('periodic-table');
	
	// Limpar tabela existente
	table.innerHTML = '';
	
	// Criar elementos da tabela periódica
	for (let i = 0; i < 118; i++) {
		const elementData = ELEMENT_DATA[i + 1];
		const elementDiv = document.createElement('div');
		elementDiv.className = `element ${elementData ? elementData.group : 'empty'}`;
		
		if (elementData) {
			elementDiv.innerHTML = `
				<div class="atomic-number">${elementData.atomicNumber}</div>
				<div class="symbol">${elementData.symbol}</div>
				<div class="name">${elementData.name}</div>
			`;
			elementDiv.addEventListener('click', () => {
				selectElement(elementData.atomicNumber);
				closePeriodicTable();
			});
		} else {
			elementDiv.style.visibility = 'hidden';
		}
		
		table.appendChild(elementDiv);
	}
	
	modal.style.display = 'flex';
}

function closePeriodicTable() {
	document.getElementById('periodic-table-modal').style.display = 'none';
}

function selectElement(atomicNumber) {
	const element = ELEMENT_DATA[atomicNumber];
	if (!element) return;

	currentElement = element;
	resetEnergy(); // Resetar energia ao mudar de elemento
	resetMagneticField(); // Resetar campo magnético
	resetTemperature(); // Resetar temperatura

	// Atualizar informações do elemento
	updateElementInfo(element);
	
	// Atualizar visualização do átomo
	updateAtomVisualization(element);
	
	// Atualizar status bar
	updateStatusBar(element);
}

function updateElementInfo(element) {
	document.getElementById('info-symbol').textContent = element.symbol;
	document.getElementById('info-symbol').className = `element-symbol ${element.group}`;
	document.getElementById('info-name').textContent = element.name;
	document.getElementById('info-group').textContent = GROUP_NAMES[element.group] || element.group;
	document.getElementById('info-atomic-number').textContent = element.atomicNumber;
	document.getElementById('info-atomic-mass').textContent = `${element.atomicMass} u`;
	document.getElementById('info-electron-config').textContent = element.electronConfiguration;
	document.getElementById('info-electronegativity').textContent = element.electronegativity || 'N/A';
	document.getElementById('info-melting-point').textContent = `${element.meltingPoint}°C`;
	document.getElementById('info-boiling-point').textContent = `${element.boilingPoint}°C`;
}

function updateAtomVisualization(element) {
	const atomDisplay = document.getElementById('atom-display');
	
	// Limpar átomo anterior (mantém as linhas de campo e partículas térmicas)
	const magneticLines = document.getElementById('magnetic-field-lines');
	const thermalParticles = document.getElementById('thermal-particles');
	atomDisplay.innerHTML = '';
	atomDisplay.appendChild(magneticLines);
	atomDisplay.appendChild(thermalParticles);
	
	// Tamanho base do núcleo (proporcional ao número atômico)
	const nucleusSize = Math.max(40, Math.min(120, element.atomicNumber * 3));
	
	// Criar núcleo
	const nucleus = document.createElement('div');
	nucleus.className = 'nucleus';
	nucleus.style.width = `${nucleusSize}px`;
	nucleus.style.height = `${nucleusSize}px`;
	nucleus.style.boxShadow = `0 0 ${nucleusSize/2}px var(--fusion-orange)`;
	
	// Criar partículas do núcleo (prótons e nêutrons)
	const nucleusInner = document.createElement('div');
	nucleusInner.className = 'nucleus-inner';
	
	const totalParticles = element.protons + element.neutrons;
	const particleSize = Math.max(3, Math.min(8, nucleusSize / 15));
	
	for (let i = 0; i < totalParticles; i++) {
		const particle = document.createElement('div');
		particle.className = 'nucleus-particle';
		
		// Alternar entre prótons e nêutrons
		if (i < element.protons) {
			particle.style.background = 'var(--proton-color)';
		} else {
			particle.className += ' neutron';
			particle.style.background = 'var(--neutron-color)';
		}
		
		particle.style.width = `${particleSize}px`;
		particle.style.height = `${particleSize}px`;
		
		// Posicionar partículas em padrão circular
		const angle = (i / totalParticles) * Math.PI * 2;
		const distance = (nucleusSize / 2) - (particleSize * 1.5);
		const x = Math.cos(angle) * distance;
		const y = Math.sin(angle) * distance;
		
		particle.style.left = `calc(50% + ${x}px)`;
		particle.style.top = `calc(50% + ${y}px)`;
		
		nucleusInner.appendChild(particle);
	}
	
	nucleus.appendChild(nucleusInner);
	atomDisplay.appendChild(nucleus);
	
	// Criar órbitas e elétrons baseados nas camadas eletrônicas
	const shellCount = element.electronShells.length;
	
	for (let shell = 0; shell < shellCount; shell++) {
		const electronsInShell = element.electronShells[shell];
		const orbitRadius = 100 + (shell * 80); // Raio aumenta para cada camada
		
		// Criar órbita
		const orbit = document.createElement('div');
		orbit.className = 'orbit';
		orbit.style.width = `${orbitRadius * 2}px`;
		orbit.style.height = `${orbitRadius * 2}px`;
		atomDisplay.appendChild(orbit);
		
		// Criar elétrons para esta camada
		for (let i = 0; i < electronsInShell; i++) {
			const electron = document.createElement('div');
			electron.className = 'electron';
			
			// Tamanho do elétron (um pouco menor para átomos maiores)
			const electronSize = Math.max(6, 10 - (element.atomicNumber / 60));
			electron.style.width = `${electronSize}px`;
			electron.style.height = `${electronSize}px`;
			
			// Posição inicial do elétron
			const angle = (i / electronsInShell) * Math.PI * 2;
			electron.dataset.orbitRadius = orbitRadius;
			electron.dataset.angle = angle;
			electron.dataset.speed = 0.02 + (shell * 0.005); // Camadas externas são mais rápidas
			electron.dataset.originalRadius = orbitRadius;
			
			atomDisplay.appendChild(electron);
		}
	}
	
	// Ajustar escala baseada no tamanho do átomo
	const scale = Math.max(0.7, 1.3 - (element.atomicNumber / 150));
	document.getElementById('scale-value').textContent = `${scale.toFixed(1)}nm`;
}

function updateStatusBar(element) {
	document.getElementById('current-element').textContent = element.name;
	document.getElementById('electron-count').textContent = element.electrons;
	
	// Determinar estado físico baseado na temperatura ambiente (25°C)
	const state = element.meltingPoint > 25 ? 'Sólido' : 
				 element.boilingPoint < 25 ? 'Gasoso' : 'Líquido';
	document.getElementById('element-state').textContent = state;
}

function startAnimation() {
	if (animationId) return;
	
	function animate() {
		const electrons = document.querySelectorAll('.electron');
		const timeScale = 1.0; // Fixo por enquanto
		
		electrons.forEach(electron => {
			let orbitRadius = parseFloat(electron.dataset.orbitRadius);
			let angle = parseFloat(electron.dataset.angle);
			let speed = parseFloat(electron.dataset.speed) * timeScale;
			
			// Efeito do campo magnético na velocidade
			if (isMagneticFieldActive) {
				// Campos magnéticos fortes podem alterar a velocidade orbital
				const magneticEffect = 1 + (magneticFieldStrength * 0.1);
				speed *= magneticEffect;
			}
			
			// Efeito da temperatura na velocidade
			if (isTemperatureApplied) {
				const thermalEffect = 1 + (currentTemperature * 0.0001);
				speed *= thermalEffect;
			}
			
			// Verificar se o elétron está excitado
			if (excitedElectrons.has(electron)) {
				const excitationTime = parseFloat(electron.dataset.excitationTime);
				const timeSinceExcitation = Date.now() - excitationTime;
				
				// Após 3 segundos, o elétron retorna ao estado fundamental
				if (timeSinceExcitation > 3000) {
					excitedElectrons.delete(electron);
					electron.classList.remove('excited');
					electron.dataset.orbitRadius = electron.dataset.originalRadius;
					
					// Emitir fóton ao retornar
					const x = Math.cos(angle) * orbitRadius + 250; // 250 = centro do canvas
					const y = Math.sin(angle) * orbitRadius + 250;
					emitPhoton(x, y);
					
					document.getElementById('excited-count').textContent = excitedElectrons.size;
					
					if (excitedElectrons.size === 0) {
						document.getElementById('reaction-status').textContent = '✅ Sistema estável';
						document.getElementById('reaction-status').style.color = 'var(--lab-white)';
					}
				} else {
					// Usar raio excitado
					orbitRadius = parseFloat(electron.dataset.excitedRadius || orbitRadius);
				}
			}
			
			angle += speed;
			electron.dataset.angle = angle;
			
			const x = Math.cos(angle) * orbitRadius;
			const y = Math.sin(angle) * orbitRadius;
			
			// Aplicar transformação mantendo o centro como referência
			electron.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
		});
		
		// Atualizar alinhamento de spin periodicamente
		if (isMagneticFieldActive && Math.random() < 0.02) {
			updateSpinAlignment();
		}
		
		animationId = requestAnimationFrame(animate);
	}
	
	animationId = requestAnimationFrame(animate);
}

function stopAnimation() {
	if (animationId) {
		cancelAnimationFrame(animationId);
		animationId = null;
	}
}

// Fechar modal ao clicar fora
document.getElementById('periodic-table-modal').addEventListener('click', function(e) {
	if (e.target === this) {
		closePeriodicTable();
	}
});

(function () {
	const path = location.pathname.split('/').pop().toLowerCase() || 'index.html';
	document.querySelectorAll('.nav-tabs .nav-tab').forEach(a => {
		const href = a.getAttribute('href')?.toLowerCase();
		if (href && path.endsWith(href)) a.classList.add('active');
	});
  })();
  
document.addEventListener('DOMContentLoaded', () => {
  const viz = document.querySelector('.visualization-area');
  if (!viz) return;

  // cria a coluna direita e injeta no grid (3ª coluna, todas as linhas)
  const right = document.createElement('div');
  right.className = 'right-col';
  viz.appendChild(right);

  // move os cards para dentro da coluna direita
  const info = document.getElementById('element-info');
  const reaction = document.querySelector('.reaction-panel');
  if (info) right.appendChild(info);
  if (reaction) right.appendChild(reaction);
});

function updateInfoHeight() {
  const info = document.getElementById('element-info');
  if (!info) return;
  const h = info.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--info-h', `${Math.round(h)}px`);
}
addEventListener('load', updateInfoHeight);
addEventListener('resize', updateInfoHeight);
// atualiza quando mudar o conteúdo do info (ex: outro elemento selecionado)
const obs = new MutationObserver(updateInfoHeight);
obs.observe(document.documentElement, { subtree: true, childList: true, characterData: true });

//---------------------------------------------------------------------------------------------

// === Layout guard: cards SEMPRE fora do canvas (colar após setupEventListeners) ===
function ensureCardsOutsideCanvas() {
  const viz = document.querySelector('.visualization-area'); // contêiner do grid
  const info = document.getElementById('element-info');
  const reaction = document.querySelector('.reaction-panel');
  if (viz) {
    if (info && info.parentElement !== viz) viz.appendChild(info);
    if (reaction && reaction.parentElement !== viz) viz.appendChild(reaction);
  }
}
document.addEventListener('DOMContentLoaded', () => {
  ensureCardsOutsideCanvas();
  // se algum código mover de novo, checamos periodicamente por alguns segundos
  setTimeout(ensureCardsOutsideCanvas, 0);
  setTimeout(ensureCardsOutsideCanvas, 500);
  setTimeout(ensureCardsOutsideCanvas, 1500);
});

// === Não esconder o painel de informações, manter reação visível ===
function handleToolSelection(tool) {
  currentTool = tool;

  // Mostrar/ocultar APENAS os painéis de controle
  const energy = document.getElementById('energy-panel');
  const magnetic = document.getElementById('magnetic-panel');
  const temperature = document.getElementById('temperature-panel');

  if (energy) energy.style.display = (tool === 'add-energy') ? 'block' : 'none';
  if (magnetic) magnetic.style.display = (tool === 'magnetic-field') ? 'block' : 'none';
  if (temperature) temperature.style.display = (tool === 'control-temperature') ? 'block' : 'none';

  // SEMPRE manter visíveis os cards da direita
  const info = document.getElementById('element-info');
  const reaction = document.querySelector('.reaction-panel');
  if (info) info.style.display = 'block';
  if (reaction) reaction.style.display = 'block';

  if (tool === 'select-atom') openPeriodicTable();
}

// === Parâmetros térmicos (colocar próximo às variáveis globais de temperatura) ===
const TEMP_K_REF = 300 + 273.15 - 273.15; // 300 K ≈ ambiente; normalização simples
const EPSK = 0.1;                          // evita zero absoluto visual

function toKelvin(celsius){ return celsius + 273.15; } // mapeia °C→K

function thermalScale(celsius){
  const Tk = Math.max(0, toKelvin(celsius));
  const Tref = 300; // ~300 K como referência
  return Math.sqrt((Tk + EPSK) / (Tref + EPSK)); // v ∝ √T
}

// Guarda os parâmetros usados no loop da animação
const thermoParams = {
  omegaBase: 0.6,        // rad/s visual a ~300 K
  jitterBase: 0.8,       // px a ~300 K
  freeBase: 80,          // px/s elétrons livres a ~300 K
  omega: 0.6,
  jitter: 0.8,
  freeSpeed: 80,
  plasma: false
};

// Atualize a cada aplicação/slider
function applyThermalParams(){
  const f = thermalScale(currentTemperature);
  if (currentTemperature <= -250) { // criogênico “quase parado”
    thermoParams.omega = Math.max(thermoParams.omegaBase * 0.06, thermoParams.omegaBase * f * 0.12);
    thermoParams.jitter = thermoParams.jitterBase * 0.05;
    thermoParams.freeSpeed = thermoParams.freeBase * 0.1;
  } else {
    thermoParams.omega = thermoParams.omegaBase * f;
    thermoParams.jitter = thermoParams.jitterBase * f;
    thermoParams.freeSpeed = thermoParams.freeBase * f;
  }
  thermoParams.plasma = currentTemperature >= 5000; // seu limiar visual
}

// Integre na UI existente
document.addEventListener('DOMContentLoaded', () => {
  applyThermalParams();
  const slider = document.getElementById('temperature-slider');
  if (slider) slider.addEventListener('input', () => applyThermalParams());
});

// Ajuste sua função applyTemperature já existente chamando applyThermalParams no final
// (adicione no final de applyTemperature):
// applyThermalParams();

// === Consumo dos fatores térmicos (exemplo de uso no loop) ===
function updateElectrons(dt){
  const electrons = document.querySelectorAll('.electron');
  electrons.forEach(el => {
    // ângulo persistente por dataset
    let angle = parseFloat(el.dataset.angle || (Math.random() * Math.PI * 2));
    const r0 = parseFloat(el.dataset.orbitRadius || 120);
    angle += thermoParams.omega * dt;            // velocidade angular escalada
    const jitter = (Math.random() - 0.5) * thermoParams.jitter; // jitter térmico
    const r = r0 + jitter;

    // centro 250,250 (tamanho padrão do seu atom-display 500x500)
    const cx = 250, cy = 250;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);

    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    el.dataset.angle = angle;
  });

  // exemplo simplificado de elétrons livres no plasma (se você os tiver separados)
  if (thermoParams.plasma) {
    const free = document.querySelectorAll('.electron.free'); // classe opcional
    free.forEach(e => {
      const dx = (parseFloat(e.dataset.dx)|| (Math.random()*2-1));
      const dy = (parseFloat(e.dataset.dy)|| (Math.random()*2-1));
      const len = Math.hypot(dx,dy) || 1;
      const vx = (dx/len) * thermoParams.freeSpeed;
      const vy = (dy/len) * thermoParams.freeSpeed;
      const x = (parseFloat(e.style.left)||250) + vx * dt;
      const y = (parseFloat(e.style.top)||250) + vy * dt;
      e.style.left = x + 'px';
      e.style.top  = y + 'px';
      e.dataset.dx = dx; e.dataset.dy = dy;
    });
  }
}

// No seu RAF principal:
let last = performance.now();
function loop(t){
  const dt = Math.min(0.05, (t - last) / 1000); // clamp a 50 ms
  last = t;
  updateElectrons(dt);
  animationId = requestAnimationFrame(loop);
}
function startAnimation(){
  if (!animationId) { last = performance.now(); animationId = requestAnimationFrame(loop); }
}
function stopAnimation(){
  if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
}

function ensureOverlaysOnCanvas() {
  const canvas = document.getElementById('atom-canvas');
  if (!canvas) return;
  ['.thermal-particles', '.magnetic-field-lines', '.reaction-area'].forEach(sel => {
    const el = document.querySelector(sel);
    if (el && el.parentElement !== canvas) canvas.appendChild(el);
  });
}
document.addEventListener('DOMContentLoaded', ensureOverlaysOnCanvas);

function spawnThermalParticle(p) {
  const area = document.getElementById('atom-canvas');
  const w = area.clientWidth, h = area.clientHeight;
  p.style.left = Math.random() * w + 'px';
  p.style.top  = Math.random() * h + 'px';
}

