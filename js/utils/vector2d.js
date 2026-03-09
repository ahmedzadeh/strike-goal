class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    
    // Add another vector
    add(vector) {
        return new Vector2D(this.x + vector.x, this.y + vector.y);
    }
    
    // Subtract another vector
    subtract(vector) {
        return new Vector2D(this.x - vector.x, this.y - vector.y);
    }
    
    // Multiply by scalar
    multiply(scalar) {
        return new Vector2D(this.x * scalar, this.y * scalar);
    }
    
    // Divide by scalar
    divide(scalar) {
        if (scalar === 0) return new Vector2D(0, 0);
        return new Vector2D(this.x / scalar, this.y / scalar);
    }
    
    // Get magnitude (length)
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    // Normalize (make unit vector)
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) return new Vector2D(0, 0);
        return this.divide(mag);
    }
    
    // Dot product
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    
    // Distance to another vector
    distanceTo(vector) {
        return this.subtract(vector).magnitude();
    }
    
    // Angle in radians
    angle() {
        return Math.atan2(this.y, this.x);
    }
    
    // Rotate by angle (radians)
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2D(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }
    
    // Clone
    clone() {
        return new Vector2D(this.x, this.y);
    }
    
    // Set values
    set(x, y) {
        this.x = x;
        this.y = y;
    }
}
