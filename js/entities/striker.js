class Striker {
    constructor(x, y) {
        this.position = new Vector2D(x, y);
        this.velocity = new Vector2D(0, 0);
        this.radius = CONSTANTS.STRIKER_RADIUS;
        this.color = CONSTANTS.COLORS.STRIKER;
        this.borderColor = CONSTANTS.COLORS.STRIKER_BORDER;
        this.mass = 1.5;
        this.isAiming = false;
        this.aimStart = null;
        this.aimEnd = null;
        this.power = 0;
    }
    
    startAiming(mousePos) {
        this.isAiming = true;
        this.aimStart = mousePos.clone();
        this.aimEnd = mousePos.clone();
    }
    
    updateAim(mousePos) {
        if (!this.isAiming) return;
        this.aimEnd = mousePos.clone();
        
        // Calculate power based on distance
        const distance = this.aimStart.distanceTo(this.aimEnd);
        this.power = Math.min(distance / 10, CONSTANTS.MAX_POWER);
    }
    
    shoot() {
        if (!this.isAiming) return false;
        
        // Calculate shot direction (opposite of drag direction)
        const direction = this.aimStart.subtract(this.aimEnd).normalize();
        
        // Apply velocity based on power
        this.velocity = direction.multiply(this.power);
        
        // Reset aiming
        this.isAiming = false;
        this.aimStart = null;
        this.aimEnd = null;
        this.power = 0;
        
        return true;
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
        // Draw striker
        ctx.save();
        
        // Shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        
        // Main circle
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Border
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Inner circle for depth
        ctx.beginPath();
        ctx.arc(this.position.x - 5, this.position.y - 5, this.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fill();
        
        ctx.restore();
        
        // Draw aiming indicator
        if (this.isAiming) {
            this.drawAimingIndicator(ctx);
        }
    }
    
    drawAimingIndicator(ctx) {
        ctx.save();
        
        // Draw power arc
        const angle = this.aimStart.subtract(this.aimEnd).angle();
        const powerRadius = this.radius + 20 + (this.power * 3);
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + this.power / CONSTANTS.MAX_POWER * 0.5})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, powerRadius, angle - 0.5, angle + 0.5);
        ctx.stroke();
        
        // Draw trajectory dots
        const direction = this.aimStart.subtract(this.aimEnd).normalize();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        
        for (let i = 1; i <= CONSTANTS.TRAJECTORY_DOTS; i++) {
            const dotPos = this.position.add(direction.multiply(i * CONSTANTS.TRAJECTORY_DOT_SPACING));
            const dotSize = 3 - (i / CONSTANTS.TRAJECTORY_DOTS * 2);
            
            ctx.beginPath();
            ctx.arc(dotPos.x, dotPos.y, dotSize, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw pull-back line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.aimEnd.x, this.aimEnd.y);
        ctx.stroke();
        
        ctx.restore();
    }
    
    reset(x, y) {
        this.position.set(x, y);
        this.velocity.set(0, 0);
        this.isAiming = false;
        this.aimStart = null;
        this.aimEnd = null;
        this.power = 0;
    }
    
    isStationary() {
        return this.velocity.magnitude() < CONSTANTS.MIN_VELOCITY;
    }
}
