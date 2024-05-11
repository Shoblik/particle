import { Rectangle } from './Rectangle.js';

export class QuadTree {
    constructor(bounds, capacity) {
        this.bounds = bounds; // Bounds of the quad tree
        this.capacity = capacity; // Maximum number of circles in a quadrant
        this.circles = []; // Circles in this quadrant
        this.subdivided = false; // Whether this quadrant has been subdivided
        this.children = []; // Array of child quadrants
    }

    insert(circle) {
        if (!this.bounds.contains(circle)) {
            return; // Circle is outside the bounds of this quadrant
        }

        if (this.circles.length < this.capacity) {
            this.circles.push(circle);
        } else {
            if (!this.subdivided) {
                this.subdivide();
            }
            for (const child of this.children) {
                child.insert(circle);
            }
        }
    }

    subdivide() {
        const x = this.bounds.x;
        const y = this.bounds.y;
        const w = this.bounds.width / 2;
        const h = this.bounds.height / 2;

        this.children.push(new QuadTree(new Rectangle(x, y, w, h), this.capacity));
        this.children.push(new QuadTree(new Rectangle(x + w, y, w, h), this.capacity));
        this.children.push(new QuadTree(new Rectangle(x, y + h, w, h), this.capacity));
        this.children.push(new QuadTree(new Rectangle(x + w, y + h, w, h), this.capacity));
        this.subdivided = true;
    }

    clear() {
        this.circles = [];
        this.subdivided = false;
        for (const child of this.children) {
            child.clear();
        }
        this.children = [];
    }

    query(range, found) {
        if (!found) {
            found = [];
        }
        if (!this.bounds.intersects(range)) {
            return found;
        }
        for (const circle of this.circles) {
            if (range.contains(circle)) {
                found.push(circle);
            }
        }
        if (this.subdivided) {
            for (const child of this.children) {
                child.query(range, found);
            }
        }
        return found;
    }
}

let QuadTreeTEst = new QuadTree;