
document.addEventListener('DOMContentLoaded', () => {
    const generateButton = document.getElementById('generate-button');
    const numbersContainer = document.getElementById('lotto-numbers-container');

    generateButton.addEventListener('click', () => {
        generateAndDisplayNumbers();
    });

    function generateAndDisplayNumbers() {
        numbersContainer.innerHTML = ''; // Clear previous numbers
        const numbers = generateLottoNumbers();

        numbers.forEach((number, index) => {
            setTimeout(() => {
                const circle = createNumberCircle(number);
                numbersContainer.appendChild(circle);
            }, index * 150); // Stagger the animation
        });
    }

    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function createNumberCircle(number) {
        const circle = document.createElement('div');
        circle.classList.add('number-circle');
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
