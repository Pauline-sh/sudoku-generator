const N = 9;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getSeedGrid() {
	const grid = [];
	const options = [];

	for (let row = 0; row < N; row++) {
			options.push(row + 1);
			for (let col = 0; col < N; col++) {
					grid.push(0);
			}
	}

	// Fill the first row and column with random list of numbers.
	const index = getRandomInt(0, options.length);
	grid[0] = options[index];
	options.splice(index, 1);
	const optionsRow = [...options];
	const optionsCol = [...options];
	for (let i = 1; i <= options.length; i++) {
		const indexRow = getRandomInt(0, optionsRow.length);
		grid[i] = optionsRow[indexRow];
		optionsRow.splice(indexRow, 1);

		const indexCol = getRandomInt(0, optionsCol.length);
		grid[N * i] = optionsCol[indexCol];
		optionsCol.splice(indexCol, 1);
	}

	return grid;
}

function isValidSudoku(grid, row, col, num) {
    for (let i = 0; i < 9; i++) {
        // Check row for number presense.
        if (grid[row * N + i] === num) {
            return false;
        }

        // Check column for number presense.
        if (grid[i * N + col] === num) {
            return false;
        }
    }

    // Check 3x3 square for number presense.
    let x = col;
    let y = row;

    while (x % 3) {
        x--;
    }

    while (y % 3) {
        y--;
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
						const curRow = y + i;
						const curCol = x + j;
            if (grid[curRow * N + curCol] === num) {
                return false;
            }
        }
    }

    return true;
}

function solveSudoku(grid, row, col) {
    // Reached the end of the grid.
    if (row === N - 1 && col === N) {
        return true;
    }

    // Start working with next row.
    if (col === N) {
        row++;
        col = 0;
    }

    // Skip already written items.
    if (grid[row * N + col] > 0) {
        return solveSudoku(grid, row, col + 1);
    }

    for (let num = 1; num < 10; num++) {
        // Try to set a number to current place.
        if (isValidSudoku(grid, row, col, num)) {
            grid[row * N + col] = num;

            // If it works we go to the next col and check next possibilities.
            if (solveSudoku(grid, row, col + 1)) {
                return true;
            }
            // Else we know that this number didn't work out and try next one.
            grid[row * N + col] = 0;
        }
    }

    return false;
}

function getNumberOfSolutions(grid) {
	let count = 0;

	function getNumberOfSolutionsInternal(grid, row, col) {
		if (row === N - 1 && col === N) {
			 	// Here I can say that solution is found and recursion starts to unwrap.
				count++;
				return true;
		}

		if (col === N) {
				row++;
				col = 0;
		}

		if (grid[row * N + col] > 0) {
				return getNumberOfSolutionsInternal(grid, row, col + 1);
		}

		for (let num = 1; num < 10; num++) {
				if (isValidSudoku(grid, row, col, num)) {
						grid[row * N + col] = num;

						if (getNumberOfSolutionsInternal(grid, row, col + 1)) {
								// If there are less than two solutions found I continue search.
								if (count < 2) {
									return false;
								}

								return true;
						}

						grid[row * N + col] = 0;
				}
		}

		return false;
	}

	const gridCopy = [...grid];
	getNumberOfSolutionsInternal(gridCopy, 0, 0);
	return count;
}

function addBlankSpaces(grid) {
	const newGrid = [];
	const indexes = [];

	for (let i = 0; i < N; i++) {
		for (let j = 0; j < N; j++) {
			newGrid.push('-');
			indexes.push(i * N + j);
		}
	}

	// Giving algorithm a head start, cause a sudoku with less than 5
	// given values is a bit cruel.
	for (let i = 0; i < 5; i++) {
		const randomIndex = getRandomInt(0, indexes.length);
		const index = indexes[randomIndex];
		newGrid[index] = grid[index];
		indexes.splice(randomIndex, 1);
	}

	// Consider sudoku ready if it has a unique solution.
	let solutionsCount = getNumberOfSolutions(newGrid);
	while (indexes.length && solutionsCount > 1) {
		const randomIndex = getRandomInt(0, indexes.length);
		const index = indexes[randomIndex];
		newGrid[index] = grid[index];
		indexes.splice(randomIndex, 1);
		solutionsCount = getNumberOfSolutions(newGrid);
	}

	return [newGrid, indexes.length];
}

function statusGenerator() {
	const messages = [
		'Baking a sudoku with unique solution...',
		'Picking the best numbers for current column...',
		'Sprinkling with blank spaces...',
		'Trying to pass quality control...',
		'Making sophisticated amendments...',
	];

	return function () {
		if (!messages.length) {
			return;
		}
		const randomIndex = getRandomInt(0, messages.length);
		const message = messages[randomIndex];
		messages.splice(randomIndex, 1);
		console.log(message);
	}
}

function createSudoku() {
	let grid;
	let numberOfBlankSpaces = 0;
	const MIN_BLANKS = 40;
	const showStatus = statusGenerator();

	// Quality control - don't let through sudokus with too few blanks to fill.
	while (numberOfBlankSpaces < MIN_BLANKS) {
		grid = getSeedGrid();
		while (!solveSudoku(grid, 0, 0)) {
			grid = getSeedGrid();
		}

		[grid, numberOfBlankSpaces] = addBlankSpaces(grid);
		showStatus();
	}

	return grid;
}

function printGrid(grid) {
	for (let i = 0; i < N; i++) {
		let str = '';
		for (let j = 0; j < N; j++) {
			str += `${grid[i * N + j]} `;
		}
		console.log(str);
	}
}

printGrid(createSudoku());