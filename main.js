
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');
    const numbersContainer = document.getElementById('lotto-numbers-container');
    const bonusContainer = document.getElementById('bonus-number-container');

    generateButton.addEventListener('click', () => {
        generateAndDisplayNumbers();
    });

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
});
