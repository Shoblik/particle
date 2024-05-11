export class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.x2 = x + width; // store the pre-calculated value
        this.y2 = y + height; // store the pre-calculated value
    }

    contains({x, y}) {
        return (
            x >= this.x &&
            x <= this.x2 && // Use pre-calculated value
            y >= this.y &&
            y <= this.y2 // Use pre-calculated value
        );
    }

    intersects({x, y, width, height}) {
        return !(
            x > this.x2 || // Use pre-calculated value
            (x + width) < this.x ||
            y > this.y2 || // Use pre-calculated value
            (y + height) < this.y
        );
    }
}