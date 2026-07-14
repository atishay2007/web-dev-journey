// Loading bar animation
window.addEventListener('load', function () {
    document.getElementById('loadingBar').style.width = '100%';
    setTimeout(function () {
        document.getElementById('loadingBar').style.display = 'none';
    }, 2000);
});

// Three.js glitchy wireframe sphere
const container = document.getElementById('canvas-box');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(250, 250);
container.appendChild(renderer.domElement);

// Create wireframe sphere
const geometry = new THREE.SphereGeometry(1.5, 16, 16);
const edges = new THREE.EdgesGeometry(geometry);
const sphere = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x4ecdc4 })
);
scene.add(sphere);

// Add initials in center (separate from sphere so it doesn't rotate)
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 256;
canvas.height = 256;
ctx.fillStyle = '#ff6b6b';
ctx.font = 'bold 100px Arial';
ctx.textAlign = 'center';
ctx.fillText('AJ', 128, 150);

const texture = new THREE.CanvasTexture(canvas);
const textPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true })
);
textPlane.position.z = 0.1;
scene.add(textPlane);

camera.position.z = 4;

// Glitch effect variables
let glitchTimer = 0;
let isGlitching = false;
let glitchDuration = 0;
const originalPositions = [];

// Store original vertex positions
const positionAttribute = geometry.attributes.position;
for (let i = 0; i < positionAttribute.count; i++) {
    originalPositions.push({
        x: positionAttribute.getX(i),
        y: positionAttribute.getY(i),
        z: positionAttribute.getZ(i)
    });
}

function glitchSphere() {
    const posAttr = geometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
        // Random displacement
        const offset = (Math.random() - 0.5) * 0.3;
        posAttr.setX(i, originalPositions[i].x + offset);
        posAttr.setY(i, originalPositions[i].y + offset);
        posAttr.setZ(i, originalPositions[i].z + offset);
    }
    posAttr.needsUpdate = true;
    edges.dispose();
    const newEdges = new THREE.EdgesGeometry(geometry);
    sphere.geometry = newEdges;
}

function resetSphere() {
    const posAttr = geometry.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
        posAttr.setX(i, originalPositions[i].x);
        posAttr.setY(i, originalPositions[i].y);
        posAttr.setZ(i, originalPositions[i].z);
    }
    posAttr.needsUpdate = true;
    edges.dispose();
    const newEdges = new THREE.EdgesGeometry(geometry);
    sphere.geometry = newEdges;
}

function animate() {
    requestAnimationFrame(animate);

    // Sphere rotates, text stays straight
    sphere.rotation.x += 0.005;
    sphere.rotation.y += 0.008;

    // Glitch effect logic
    glitchTimer++;

    if (!isGlitching && glitchTimer > 120 + Math.random() * 180) {
        isGlitching = true;
        glitchDuration = 0;
        glitchTimer = 0;
    }

    if (isGlitching) {
        glitchDuration++;

        // Rapid glitching
        if (glitchDuration % 3 === 0) {
            glitchSphere();
        }

        // End glitch and reform
        if (glitchDuration > 15) {
            resetSphere();
            isGlitching = false;
        }
    }

    renderer.render(scene, camera);
}
animate();

// Mode toggle
let isSerious = true;
const modeBtn = document.getElementById('modeToggle');

const seriousTexts = {
    tagline: "CS student at VIT who codes and breaks stuff",
    about1: "I'm 18, first year CS Core at VIT. I pick up stuff pretty quick and like building things. Lived in the US for a bit, now back in India.",
    about2: "I got 97% in 10th so academics are fine. Outside college I swim, play badminton, and run sometimes. Trying to get healthier honestly.",
    about3: "I like organizing things and helping people figure stuff out. Deleted Instagram to focus better. I'm chill but overthink a bit. Good at writing, not so good at socializing. Vegetarian. Into clean design and learning new tech.",
    project1: "Used Three.js for the rotating cube. Kept it simple and clean.",
    project2: "Built a terminal-based todo list to practice file handling and basic data structures. Nothing fancy but it works.",
    project3: "Set up my GitHub properly with a README and organized repos. Still learning version control and open source stuff."
};

const unhingedTexts = {
    tagline: "I fight compiler errors daily and somehow still survive",
    about1: "I learn things so fast it's borderline suspicious. Seriously. Give me 2 hours with any tech and I'll figure it out. It's a blessing and a curse.",
    about2: "Academic stuff? Easy. Real life? Slightly terrifying but we're managing. I've survived 18 years without coffee which is impressive considering I'm a CS student.",
    about3: "My friends call me for writing texts because apparently I sound human. I organize everything. EVERYTHING. Even things that don't need organizing. Send help.",
    project1: "Built this entire portfolio to flex Three.js skills and show I'm not just another copy-paste warrior. My code works on the third try usually.",
    project2: "Made a todo app because I needed to organize my life. Spoiler: my life is still chaotic but at least my tasks are in a text file now.",
    project3: "Spent way too much time making my GitHub look aesthetic. Do I have commits? Yes. Do they make sense? Sometimes. Am I proud? Absolutely."
};

modeBtn.addEventListener('click', function () {
    isSerious = !isSerious;
    if (isSerious) {
        modeBtn.textContent = 'Serious Atishay';
        document.getElementById('tagline').textContent = seriousTexts.tagline;
        document.getElementById('aboutText1').textContent = seriousTexts.about1;
        document.getElementById('aboutText2').textContent = seriousTexts.about2;
        document.getElementById('aboutText3').textContent = seriousTexts.about3;
        document.getElementById('project1').textContent = seriousTexts.project1;
        document.getElementById('project2').textContent = seriousTexts.project2;
        document.getElementById('project3').textContent = seriousTexts.project3;
    } else {
        modeBtn.textContent = 'Unhinged Atishay';
        document.getElementById('tagline').textContent = unhingedTexts.tagline;
        document.getElementById('aboutText1').textContent = unhingedTexts.about1;
        document.getElementById('aboutText2').textContent = unhingedTexts.about2;
        document.getElementById('aboutText3').textContent = unhingedTexts.about3;
        document.getElementById('project1').textContent = unhingedTexts.project1;
        document.getElementById('project2').textContent = unhingedTexts.project2;
        document.getElementById('project3').textContent = unhingedTexts.project3;
    }
});

// Random facts
const facts = [
    "I learn insanely fast, like borderline suspicious.",
    "I've survived 18 years without coffee. Barely.",
    "My code works on the third try usually.",
    "My friends call me for writing texts because apparently I sound human.",
    "I can organize literally anything except my own sleep schedule.",
    "Deleted Instagram and honestly? Best decision ever.",
    "I overthink everything but somehow it works out.",
    "Vegetarian but will defend paneer supremacy to the death.",
    "Academic topper but can't remember where I kept my keys 5 minutes ago."
];

document.getElementById('factBtn').addEventListener('click', function () {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    document.getElementById('factDisplay').textContent = randomFact;
});

// Rating slider
const slider = document.getElementById('ratingSlider');
const feedback = document.getElementById('ratingFeedback');

slider.addEventListener('input', function () {
    const value = parseInt(this.value);
    if (value <= 3) {
        feedback.textContent = "Ok rude.";
    } else if (value <= 7) {
        feedback.textContent = "Accurate tbh.";
    } else {
        feedback.textContent = "Love you chief.";
    }
});

// Konami code easter egg
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', function (e) {
    konamiCode.push(e.key);
    if (konamiCode.length > 10) konamiCode.shift();

    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.getElementById('easterEgg').classList.add('show');
        setTimeout(function () {
            document.getElementById('easterEgg').classList.remove('show');
        }, 3000);
    }
});