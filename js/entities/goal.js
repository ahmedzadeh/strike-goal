class Goal {
    constructor(x, y) {
        this.position = new Vector2D(x, y);
        this.width = CONSTANTS.GOAL_WIDTH;
        this.height = CONSTANTS.GOAL_HEIGHT;
        this.color = CONSTANTS.COLORS.GOAL;
        this.netColor = CONSTANTS.COLORS.GOAL_NET;
    }
    
    draw(ctx) {
        ctx.save();
        
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        
        // Goal back net
        ctx.fillStyle = this.netColor;
        ctx.fillRect(
            this.position.x - halfWidth,
            this.position.y - halfHeight,
            this.width,
            this.height
        );
        
        // Net pattern
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 1;
        const netSpacing = 10;
        
        // Vertical lines
        for (let x = -halfWidth; x <= halfWidth; x += netSpacing) {
            ctx.beginPath();
            ctx.moveTo(this.position.x + x, this.position.y - halfHeight);
            ctx.lineTo(this.position.x + x, this.position.y + halfHeight);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = -halfHeight; y <= halfHeight; y += netSpacing) {
            ctx.beginPath();
            ctx.moveTo(this.position.x - halfWidth, this.position.y + y);
            ctx.lineTo(this.position.x + halfWidth, this.position.y + y);
            ctx.stroke();
        }
        
        // Goal posts
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        
        // Left post
        ctx.beginPath();
        ctx.moveTo(this.position.x - halfWidth, this.position.y - halfHeight);
        ctx.lineTo(this.position.x - halfWidth, this.position.y + halfHeight);
        ctx.stroke();
        
        // Right post
        ctx.beginPath();
        ctx.moveTo(this.position.x + halfWidth, this.position.y - halfHeight);
        ctx.lineTo(this.position.x + halfWidth, this.position.y + halfHeight);
        ctx.stroke();
        
        // Top post
        ctx.beginPath();
        ctx.moveTo(this.position.x - halfWidth, this.position.y - halfHeight);
        ctx.lineTo(this.position.x + halfWidth, this.position.y - halfHeight);
        ctx.stroke();
        
        ctx.restore();
    }
}
