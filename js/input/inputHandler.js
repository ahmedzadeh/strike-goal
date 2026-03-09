class InputHandler {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.game = game;
        this.mousePos = new Vector2D(0, 0);
        this.isMouseDown = false;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    getMousePos(event) {
        const rect = this.canvas.getBoundingClientRect();
        return new Vector2D(
            event.clientX - rect.left,
            event.clientY - rect.top
        );
    }
    
    getTouchPos(event) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        return new Vector2D(
            touch.clientX - rect.left,
            touch.clientY - rect.top
        );
    }
    
    handleMouseDown(event) {
        this.mousePos = this.getMousePos(event);
        this.isMouseDown = true;
        
        // Check if clicking on striker
        const striker = this.game.striker;
        const distance = this.mousePos.distanceTo(striker.position);
        
        if (distance <= striker.radius && striker.isStationary()) {
            striker.startAiming(this.mousePos);
        }
    }
    
    handleMouseMove(event) {
        this.mousePos = this.getMousePos(event);
        
        if (this.isMouseDown && this.game.striker.isAiming) {
            this.game.striker.updateAim(this.mousePos);
            this.updatePowerIndicator();
        }
    }
    
    handleMouseUp(event) {
        if (this.game.striker.isAiming) {
            const shot = this.game.striker.shoot();
            if (shot) {
                this.game.onShot();
            }
        }
        
        this.isMouseDown = false;
        this.hidePowerIndicator();
    }
    
    // Touch event handlers
    handleTouchStart(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.handleMouseDown(mouseEvent);
    }
    
    handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.handleMouseMove(mouseEvent);
    }
    
    handleTouchEnd(event) {
        event.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        this.handleMouseUp(mouseEvent);
    }
    
    updatePowerIndicator() {
        const powerIndicator = document.getElementById('power-indicator');
        const powerBar = document.getElementById('power-bar');
        
        powerIndicator.classList.add('active');
        const powerPercent = (this.game.striker.power / CONSTANTS.MAX_POWER) * 100;
        powerBar.style.width = powerPercent + '%';
    }
    
    hidePowerIndicator() {
        const powerIndicator = document.getElementById('power-indicator');
        powerIndicator.classList.remove('active');
    }
}
