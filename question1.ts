


function optimizeBookings(bookings: number[][]): number[][] {
    if (bookings.length === 0) {
        return [];
    }

    bookings.sort((a, b) => a[0] - b[0]);

    const optimized: number[][] = [];
    let currentStart = bookings[0][0];
    let currentEnd = bookings[0][1];

    for (let i = 1; i < bookings.length; i++) {
        const [start, end] = bookings[i];

        if (start <= currentEnd) {
            currentEnd = Math.max(currentEnd, end);
        } else {
            optimized.push([currentStart, currentEnd]);
            currentStart = start;
            currentEnd = end;
        }
    }

    optimized.push([currentStart, currentEnd]);

    return optimized;
}

// Example test cases
console.log(optimizeBookings([[9, 12], [11, 13], [14, 17], [16, 18]])); 


module.exports = { optimizeBookings };
