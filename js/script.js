const courseFormulas = {
    PDSA: {
        inputs: ['gaa', 'f', 'op', 'qz1', 'qz2'],
        calculate: ({gaa, f, op, qz1 = 0, qz2 = 0}) => {
            const quizComponent = Math.max(0.2 * Math.max(qz1, qz2), (0.15 * qz1 + 0.15 * qz2));
            return 0.1 * gaa + 0.4 * f + 0.2 * op + quizComponent;
        }
    },
    DBMS: {
        inputs: ['gaa1', 'gaa2', 'gaa3', 'f', 'op', 'qz1', 'qz2'],
        calculate: ({gaa1, gaa2, gaa3, f, op, qz1 = 0, qz2 = 0}) => {
            const quizComponent = Math.max(
                0.45 * f + 0.15 * Math.max(qz1, qz2),
                0.4 * f + (0.10 * qz1 + 0.20 * qz2)
            );
            return 0.04 * gaa1 + 0.03 * gaa2 + 0.03 * gaa3 + 0.2 * op + quizComponent;
        }
    },
    MLT: {
        inputs: ['gaa', 'f', 'qz1', 'qz2', 'bonus'],
        calculate: ({gaa, f, qz1 = 0, qz2 = 0, bonus = false}) => {
            const quizComponent = Math.max(
                0.25 * qz1 + 0.25 * qz2,
                0.4 * Math.max(qz1, qz2)
            );
            let score = 0.1 * gaa + 0.4 * f + quizComponent;
            return bonus ? score + 3 : score;
        }
    },
    MLF: {
        inputs: ['gaa', 'f', 'qz1', 'qz2'],
        calculate: ({gaa, f, qz1 = 0, qz2 = 0}) => {
            const quizComponent = Math.max(
                0.6 * f + 0.2 * Math.max(qz1, qz2),
                0.4 * f + 0.2 * qz1 + 0.3 * qz2
            );
            return 0.1 * gaa + quizComponent;
        }
    }
};

const inputLabels = {
    gaa: 'GAA Score',
    gaa1: 'GAA1 Score',
    gaa2: 'GAA2 Score',
    gaa3: 'GAA3 Score',
    f: 'Final Exam Score',
    op: 'OPPE Score',
    qz1: 'Quiz 1 Score (0 if not attempted)',
    qz2: 'Quiz 2 Score (0 if not attempted)',
    bonus: 'Eligible for 3-mark bonus?'
};

function createInputElement(field) {
    const container = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = inputLabels[field];
    
    if (field === 'bonus') {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = field;
        checkbox.addEventListener('change', calculateScore);
        container.classList.add('bonus-group');
        container.appendChild(checkbox);
        container.appendChild(label);
        return container;
    }

    const input = document.createElement('input');
    input.type = 'number';
    input.min = 0;
    input.max = 100;
    input.step = 0.1;
    input.id = field;
    input.placeholder = `Enter ${inputLabels[field]} (0-100)`;
    input.addEventListener('input', calculateScore);

    container.appendChild(label);
    container.appendChild(input);
    return container;
}

function updateInputs() {
    const course = document.getElementById('course-select').value;
    const container = document.getElementById('inputs-container');
    container.innerHTML = '';
    
    courseFormulas[course].inputs.forEach(field => {
        container.appendChild(createInputElement(field));
    });
    
    calculateScore();
}

function calculateScore() {
    const course = document.getElementById('course-select').value;
    const inputs = courseFormulas[course].inputs.reduce((acc, field) => {
        if (field === 'bonus') {
            acc[field] = document.getElementById(field)?.checked || false;
        } else {
            const value = parseFloat(document.getElementById(field)?.value) || 0;
            acc[field] = Math.min(100, Math.max(0, value));
        }
        return acc;
    }, {});

    const score = courseFormulas[course].calculate(inputs);
    document.getElementById('result').textContent = 
        `Estimated Score: ${score.toFixed(2)}`;
}

// Initial setup
document.getElementById('course-select').addEventListener('change', updateInputs);
document.addEventListener('DOMContentLoaded', updateInputs);