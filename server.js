// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Validate magic square
function validateMagicSquare(grid) {
    const targetSum = 15;
    const result = {
        isValid: false,
        message: ''
    };

    // Convert all values to numbers
    const squares = grid.map(val => Number(val));

    // Check if all numbers 1-9 are used exactly once
    const usedNumbers = new Set(squares);
    if (usedNumbers.size !== 9 || !squares.every(n => n >= 1 && n <= 9)) {
        result.message = 'Use numbers 1-9 exactly once';
        return result;
    }

    // Check rows
    for (let i = 0; i < 9; i += 3) {
        const sum = squares[i] + squares[i + 1] + squares[i + 2];
        if (sum !== targetSum) {
            result.message = `Row ${i/3 + 1} sum (${sum}) should be ${targetSum}`;
            return result;
        }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
        const sum = squares[i] + squares[i + 3] + squares[i + 6];
        if (sum !== targetSum) {
            result.message = `Column ${i + 1} sum (${sum}) should be ${targetSum}`;
            return result;
        }
    }

    // Check diagonals
    const diagonal1 = squares[0] + squares[4] + squares[8];
    const diagonal2 = squares[2] + squares[4] + squares[6];
    
    if (diagonal1 !== targetSum) {
        result.message = `Main diagonal sum (${diagonal1}) should be ${targetSum}`;
        return result;
    }
    
    if (diagonal2 !== targetSum) {
        result.message = `Secondary diagonal sum (${diagonal2}) should be ${targetSum}`;
        return result;
    }

    result.isValid = true;
    result.message = 'Congratulations! You created a valid magic square!';
    return result;
}

// API endpoint to check magic square
app.post('/api/check', (req, res) => {
    const { grid } = req.body;
    const result = validateMagicSquare(grid);
    res.json(result);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});