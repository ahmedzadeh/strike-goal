class Physics {
    static checkCircleCollision(obj1, obj2) {
        const distance = obj1.position.distanceTo(obj2.position);
        const minDistance = obj1.radius + obj2.radius;
        return distance < minDistance;
    }
    
    static resolveCircleCollision(obj1, obj2) {
        // Calculate collision vector
        const collisionVector = obj1.position.subtract(obj2.position);
        const distance = collisionVector.magnitude();
        
        // Normalize collision vector
        const collisionNormal = collisionVector.normalize();
        
        // Calculate relative velocity
        const relativeVelocity = obj1.velocity.subtract(obj2.velocity);
        
        // Calculate speed along collision normal
        const speed = relativeVelocity.dot(collisionNormal);
        
        // Objects moving apart, no collision response needed
        if (speed > 0) return;
        
        // Calculate impulse scalar
        const impulse = 2 * speed / (obj1.mass + obj2.mass);
        
        // Apply impulse to velocities
        obj1.velocity = obj1.velocity.subtract(
            collisionNormal.multiply(impulse * obj2.mass * CONSTANTS.RESTITUTION)
        );
        obj2.velocity = obj2.velocity.add(
            collisionNormal.multiply(impulse * obj1.mass * CONSTANTS.RESTITUTION)
        );
        
        // Separate objects to prevent overlap
        const overlap = (obj1.radius + obj2.radius) - distance;
        const separation = collisionNormal.multiply(overlap / 2);
        obj1.position = obj1.position.add(separation);
        obj2.position = obj2.position.subtract(separation);
    }
    
    static checkWallCollision(obj, bounds) {
        const { x, y } = obj.position;
        const r = obj.radius;
        
        let collision = false;
        
        // Left wall
        if (x - r < bounds.left) {
            obj.position.x = bounds.left + r;
            obj.velocity.x = Math.abs(obj.velocity.x) * CONSTANTS.RESTITUTION;
            collision = true;
        }
        // Right wall
        else if (x + r > bounds.right) {
            obj.position.x = bounds.right - r;
            obj.velocity.x = -Math.abs(obj.velocity.x) * CONSTANTS.RESTITUTION;
            collision = true;
        }
        
        // Top wall
        if (y - r < bounds.top) {
            obj.position.y = bounds.top + r;
            obj.velocity.y = Math.abs(obj.velocity.y) * CONSTANTS.RESTITUTION;
            collision = true;
        }
        // Bottom wall
        else if (y + r > bounds.bottom) {
            obj.position.y = bounds.bottom - r;
            obj.velocity.y = -Math.abs(obj.velocity.y) * CONSTANTS.RESTITUTION;
            collision = true;
        }
        
        return collision;
    }
    
    static checkGoalCollision(ball, goal) {
        const ballLeft = ball.position.x - ball.radius;
        const ballRight = ball.position.x + ball.radius;
        const ballTop = ball.position.y - ball.radius;
        const ballBottom = ball.position.y + ball.radius;
        
        const goalLeft = goal.position.x - goal.width / 2;
        const goalRight = goal.position.x + goal.width / 2;
        const goalTop = goal.position.y - goal.height / 2;
        const goalBottom = goal.position.y + goal.height / 2;
        
        return ballRight > goalLeft &&
               ballLeft < goalRight &&
               ballBottom > goalTop &&
               ballTop < goalBottom;
    }
    
    static applyFriction(velocity) {
        return velocity.multiply(CONSTANTS.FRICTION);
    }
    
    static isMoving(velocity) {
        return velocity.magnitude() > CONSTANTS.MIN_VELOCITY;
    }
}
