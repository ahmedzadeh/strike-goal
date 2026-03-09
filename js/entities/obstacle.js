class Obstacle {
    constructor(x, y, type = 'static') {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.radius = CONSTANTS.OBSTACLE_RADIUS;
        this.color = CONSTANTS.COLORS.OBSTACLE;
        this.borderColor = CONSTANTS.COLORS.OBSTACLE_BORDER;
        this.mass = type === 'static' ? Infinity : 1.2;
        this.type = type; // 'static' or 'dynamic'
        
        // For moving obstacles
        this.movementPattern = null;
        this.movementTime = 0;
    }
    
    setMovementPattern(pattern) {
        this.movementPattern = pattern;
        this.type = 'moving';
    }
    
    update(deltaTime) {
        if (this.type === 'moving' && this.movementPattern) {
            this.movementTime += deltaTime;
            const newPos = this.movementPattern(this.movementTime);
            this.velocity = newPos.subtract(this.position);
            this.position = newPos;
        } else if (this.type === 'dynamic') {
            // Update position for dynamic obstacles
            this.position = this.position.add(this.velocity);
            
            // Apply friction
            this.velocity = Physics.applyFriction(this.velocity);
            
            // Stop if velocity is too small
            if (!Physics.isMoving(this.velocity)) {
                this.velocity.set(0, 0);
            }
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Main circle
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Type indicator
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (this.type === 'static') {
            // Draw X for static
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 3;
            const size = this.radius * 0.5;
            ctx.beginPath();
            ctx.moveTo(this.position.x - size, this.position.y - size);
            ctx.lineTo(this.position.x + size, this.position.y + size);
            ctx.moveTo(this.position.x + size, this.position.y - size);
            ctx.lineTo(this.position.x - size, this.position.y + size);
            ctx.stroke();
        } else if (this.type === 'moving') {
            // Draw arrows for moving
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillText('↔', this.position.x, this.position.y);
        }
        
        ctx.restore();
    }
}
