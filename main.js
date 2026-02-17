
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');
    const numbersContainer = document.getElementById('lotto-numbers-container');
    const bonusContainer = document.getElementById('bonus-number-container');
    const startButton = document.getElementById('leaf-start-button');
    const webcamContainer = document.getElementById('webcam-container');
    const labelContainer = document.getElementById('label-container');
    const statusLabel = document.getElementById('leaf-status');

    generateButton.addEventListener('click', () => {
        generateAndDisplayNumbers();
    });

    const URL = 'https://teachablemachine.withgoogle.com/models/Of89EgVxI/';
    let model;
    let webcam;
    let maxPredictions = 0;
    let isRunning = false;

    function generateAndDisplayNumbers() {
        numbersContainer.innerHTML = ''; // Clear previous numbers
        bonusContainer.innerHTML = '';
        const { numbers, bonus } = generateLottoNumbers();

        numbers.forEach((number, index) => {
            setTimeout(() => {
                const circle = createNumberCircle(number);
                numbersContainer.appendChild(circle);
            }, index * 150); // Stagger the animation
        });

        setTimeout(() => {
            const bonusCircle = createNumberCircle(bonus, 'bonus-circle');
            bonusContainer.appendChild(bonusCircle);
        }, numbers.length * 150 + 150);
    }

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        let bonus = Math.floor(Math.random() * 45) + 1;
        while (numbers.has(bonus)) {
            bonus = Math.floor(Math.random() * 45) + 1;
        }

        return {
            numbers: Array.from(numbers).sort((a, b) => a - b),
            bonus,
        };
    }

    function createNumberCircle(number, extraClass = '') {
        const circle = document.createElement('div');
        circle.classList.add('number-circle');
        if (extraClass) {
            circle.classList.add(extraClass);
        }
        circle.textContent = number;
        
        // Assign color based on number range
        let colorClass = '';
        if (number <= 10) {
            colorClass = 'color-1-10';
        } else if (number <= 20) {
            colorClass = 'color-11-20';
        } else if (number <= 30) {
            colorClass = 'color-21-30';
        } else if (number <= 40) {
            colorClass = 'color-31-40';
        } else {
            colorClass = 'color-41-45';
        }

        // The actual colors are defined in the CSS, but we can add the class here.
        // To make this work, we'd add styles like:
        // .number-circle.color-1-10 { background-image: linear-gradient(...) }
        // For now, we'll stick to the single color scheme from the CSS for simplicity.

        return circle;
    }

    if (startButton) {
        startButton.addEventListener('click', () => {
            if (!isRunning) {
                initTeachableMachine();
            }
        });
    }

    async function initTeachableMachine() {
        try {
            statusLabel.textContent = '모델 로딩 중...';
            startButton.disabled = true;

            const modelURL = `${URL}model.json`;
            const metadataURL = `${URL}metadata.json`;

            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            const flip = true;
            webcam = new tmImage.Webcam(240, 240, flip);
            await webcam.setup();
            await webcam.play();
            isRunning = true;

            webcamContainer.innerHTML = '';
            webcamContainer.appendChild(webcam.canvas);

            labelContainer.innerHTML = '';
            for (let i = 0; i < maxPredictions; i += 1) {
                const row = document.createElement('div');
                row.className = 'label-row';
                labelContainer.appendChild(row);
            }

            statusLabel.textContent = '분석 중...';
            window.requestAnimationFrame(loop);
        } catch (error) {
            console.error(error);
            statusLabel.textContent = '모델 로딩 실패';
            startButton.disabled = false;
        }
    }

    async function loop() {
        if (!isRunning) {
            return;
        }
        webcam.update();
        await predict();
        window.requestAnimationFrame(loop);
    }

    async function predict() {
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i += 1) {
            const classPrediction = `${prediction[i].className}: ${prediction[i].probability.toFixed(2)}`;
            labelContainer.childNodes[i].textContent = classPrediction;
        }
    }
});
