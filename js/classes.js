class Sprite {
	constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}) {
		this.position = position
		this.width = 50
		this.height = 150
		this.image = new Image()
		this.image.src = imageSrc
		this.scale = scale
		this.framesMax = framesMax
		this.framesCurrent = 0
		this.framesElapsed = 0
		this.framesHold = 10
		this.offset = offset
	}

	draw() {
		c.drawImage(
			this.image, 
			this.framesCurrent * this.image.width / this.framesMax,
			0,
			this.image.width / this.framesMax,
			this.image.height,
			this.position.x - this.offset.x, 
			this.position.y - this.offset.y, 
			this.image.width / this.framesMax * this.scale, 
			this.image.height * this.scale
			)
	}

	animateFrame() {
		if(this.framesElapsed++ % this.framesHold === 0)
		this.framesCurrent = (this.framesCurrent + 1) % this.framesMax
	}

	update() {
		this.draw()
		this.animateFrame()
	}

}

class Fighter extends Sprite{
	/**
	 * position 位置
	 * velocity 速度
	 **/ 
	constructor({
		position, 
		velocity, 
		color = 'red', 
		imageSrc, 
		scale = 1, 
		framesMax = 1,
		offset = {x: 0, y: 0},
		sprites,
		attackBox = {offset : {}, width: undefined, height: undefined}
		}) {
		super({
			position,
			imageSrc,
			scale,
			framesMax,
			offset
		})

		this.position = position
		this.velocity = velocity
		this.width = 50
		this.height = 150
		this.speed = 4
		// lastKey 总以lastKey作为移动方向
		this.lastKey
		// attackBox 设置人物攻击范围
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset: attackBox.offset, 
			width: attackBox.width,
			height: attackBox.height
		}
		// color
		this.color = color
		// attacking
		this.isAttacking
		// health
		this.health = 100
		this.framesCurrent = 0
		this.framesElapsed = 0
		this.framesHold = 10
		this.sprites = sprites
		this.dead = false

		for (const sprite in sprites) {
			sprites[sprite].image = new Image()
			sprites[sprite].image.src = sprites[sprite].imageSrc
		}
	}


	update() {
		this.draw()
		if(!this.dead)
		this.animateFrame()
		// attackbox更新
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y + this.attackBox.offset.y
		// attackbox block
		// c.fillRect(
		// 	this.attackBox.position.x,
		// 	this.attackBox.position.y,
		// 	this.attackBox.width,
		// 	this.attackBox.height
		// 	)

		// 横轴更新
		this.position.x += this.velocity.x
		// 纵轴更新
		this.position.y += this.velocity.y

		// gravity function
		if(this.position.y + this.height + this.velocity.y >= canvas.height - 96){
			this.velocity.y = 0
			this.position.y = 330
		}
		else 
			this.velocity.y += gravity
	}

	// jump
	jump() {
		// 防止无限jump
		if (this.position.y + this.height >= canvas.height - 96) {
				this.velocity.y = -5
			}
	}

	// attack
	attack() {
		this.switchSprite('attack1')
		this.isAttacking = true
		setTimeout(() => {
			this.isAttacking = false
		}, 1000)
	}

	// takehit
	takeHit(){
		this.health -= 10
		if(this.health > 0) {
			this.switchSprite('takeHit')
		} else this.switchSprite('death')
	}

	switchSprite(sprite) {
		if(this.image === this.sprites.death.image) {
			if(this.framesCurrent === this.sprites.death.framesMax - 1) this.dead = true
			return
		}
		// overriding all other animations with the attack animation
		if(this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) 
			return
		// override when fighter gets hit
		if(this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1)
			return
		switch (sprite) {
			case 'idle':
				if (this.image !== this.sprites.idle.image) {
					this.image = this.sprites.idle.image
					this.framesMax = this.sprites.idle.framesMax
					this.framesCurrent = 0
				}
				break
			case 'run':
				if (this.image !== this.sprites.run.image) {
					this.image = this.sprites.run.image
					this.framesMax = this.sprites.run.framesMax
					this.framesCurrent = 0
				}
				break
			case 'jump':
				if (this.image !== this.sprites.jump.image) {
					this.image = this.sprites.jump.image
					this.framesMax = this.sprites.jump.framesMax
					this.framesCurrent = 0
				}
				break
			case 'fall':
				if (this.image !== this.sprites.fall.image) {
					this.image = this.sprites.fall.image
					this.framesMax = this.sprites.fall.framesMax
					this.framesCurrent = 0
				}
				break
			case 'attack1':
				if (this.image !== this.sprites.attack1.image) {
					this.image = this.sprites.attack1.image
					this.framesMax = this.sprites.attack1.framesMax
					this.framesCurrent = 0
				}
				break
			case 'takeHit':
				if (this.image !== this.sprites.takeHit.image) {
					this.image = this.sprites.takeHit.image
					this.framesMax = this.sprites.takeHit.framesMax
					this.framesCurrent = 0
				}
				break
			case 'death':
				if (this.image !== this.sprites.death.image) {
					this.image = this.sprites.death.image
					this.framesMax = this.sprites.death.framesMax
					this.framesCurrent = 0
				}
				break
		}
	}
}