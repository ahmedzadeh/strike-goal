class Ball {
    constructor(x, y) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.radius = CONSTANTS.BALL_RADIUS;
        this.color = CONSTANTS.COLORS.BALL;
        this.borderColor = CONSTANTS.COLORS.BALL_BORDER;
        this.mass = 1;
        this.inGoal = false;
    }
    
    update() {
        // Update position
        this.position = this.position.add(this.velocity);
        
        // Apply friction
        this.velocity = Physics.applyFriction(this.velocity);
        
        // Stop if velocity is too small
        if (!Physics.isMoving(this.velocity)) {
            this.velocity.set(0, 0);
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
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Soccer ball pattern
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        
        // Pentagon pattern (simplified)
        const pentagonRadius = this.radius * 0.6;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI / 5) - Math.PI / 2;
            const x = this.position.x + Math.cos(angle) * pentagonRadius;
            const y = this.position.y + Math.sin(angle) * pentagonRadius;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
    }
    
    reset(x, y) {
        this.position.set(x, y);
        this.velocity.set(0, 0);
        this.inGoal = false;
    }
    
    isStationary() {
        return this.velocity.magnitude() < CONSTANTS.MIN_VELOCITY;
    }
}
