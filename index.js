// 创建画布
const canvas = document.querySelector('canvas')
// 获取2d上下文内容
const c = canvas.getContext('2d')

// 设置画布大小
canvas.width = 1024
canvas.height = 576

// 填充矩形，显式通过画布编码游戏
c.fillRect(0, 0, canvas.width, canvas.height)

// 重力常量
const gravity = 0.1

// background
const background = new Sprite({
	position: {
		x: 0,
		y: 0
	}, 
	imageSrc: './img/background.png'
})
// shop
const shop = new Sprite({
	position: {
		x: 620,
		y: 128
	}, 
	imageSrc: './img/shop.png',
	scale: 2.75,
	framesMax: 6
})

// 玩家
const player = new Fighter({
	position: {
		x: 200,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	offset: {
		x: 0,
		y: 0
	},
	imageSrc: './img/samuraiMack/Idle.png',
	framesMax: 8,
	scale: 2.5,
	offset: {
		x: 215,
		y: 157
	},
	sprites: {
		idle: {
			imageSrc: './img/samuraiMack/Idle.png',
			framesMax: 8
		},
		run : {
			imageSrc: './img/samuraiMack/Run.png',
			framesMax: 8
		},
		jump : {
			imageSrc: './img/samuraiMack/Jump.png',
			framesMax: 2
		},
		fall : {
			imageSrc: './img/samuraiMack/Fall.png',
			framesMax: 2
		},
		attack1 : {
			imageSrc: './img/samuraiMack/Attack1.png',
			framesMax: 6
		},
		takeHit : {
			imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
			framesMax: 4
		},
		death : {
			imageSrc: './img/samuraiMack/Death.png',
			framesMax: 6
		}

	},
	attackBox: {
		offset:{
			x: 100,
			y: 50
		},
		width: 150,
		height: 50
	}
})



// 敌人
const enemy = new Fighter({
	position: {
		x: 774,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	color: 'blue',
	offset: {
		x: -50,
		y: 0
	},
	imageSrc: './img/kenji/Idle.png',
	framesMax: 4,
	scale: 2.5,
	offset: {
		x: 215,
		y: 170
	},
	sprites: {
		idle: {
			imageSrc: './img/kenji/Idle.png',
			framesMax: 4
		},
		run : {
			imageSrc: './img/kenji/Run.png',
			framesMax: 8
		},
		jump : {
			imageSrc: './img/kenji/Jump.png',
			framesMax: 2
		},
		fall : {
			imageSrc: './img/kenji/Fall.png',
			framesMax: 2
		},
		attack1 : {
			imageSrc: './img/kenji/Attack1.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './img/kenji/Take hit.png',
			framesMax: 3
		},
		death : {
			imageSrc: './img/kenji/Death.png',
			framesMax: 7
		}
	},
	attackBox: {
		offset:{
			x: -170,
			y: 50
		},
		width: 170,
		height: 50
	}
})

console.log(player)

// 精准移动
const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	}
}

decTimer()

function animate() {
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	background.update()
	shop.update()
	c.fillStyle = 'rgba(255,255,255,0.15)'
	c.fillRect(0, 0, canvas.width, canvas.height)

	player.update()
	enemy.update()

	player.velocity.x = 0
	enemy.velocity.x = 0
	// player movement
	if (keys.a.pressed && player.lastKey === 'a') {
		player.velocity.x = -player.speed
		player.switchSprite('run')
	} else if(keys.d.pressed && player.lastKey === 'd') {
		player.velocity.x = player.speed
		player.switchSprite('run')
	} else {
		player.switchSprite('idle')
	}

	if (player.velocity.y < 0) {
		player.switchSprite('jump')
	} else if (player.velocity.y > 0){
		player.switchSprite('fall')
	}

	// enemy movement
	if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
		enemy.velocity.x = -enemy.speed
		enemy.switchSprite('run')
	} else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
		enemy.velocity.x = enemy.speed
		enemy.switchSprite('run')
	} else {
		enemy.switchSprite('idle')
	}

	if (enemy.velocity.y < 0) {
		enemy.switchSprite('jump')
	} else if (enemy.velocity.y > 0){
		enemy.switchSprite('fall')
	}

	// 攻击碰撞检测 of player & player gets hit
	if(rectangularCollision({
		rectangle1: player,
		rectangle2: enemy
	}) && player.isAttacking && player.framesCurrent === 4){
		enemy.takeHit()
		// player.isAttacking = false
		console.log('player is attacking')
		// document.querySelector('#enemyHealth').style.width = enemy.health + '%'
		gsap.to('#enemyHealth', {
			width: enemy.health + '%'
		})
	}
	// 提前结束碰撞检测 of player
	if(player.isAttacking && player.framesCurrent === 4) player.isAttacking = false

	// 攻击碰撞检测 of enemy & enemy gets hit
	if(rectangularCollision({
		rectangle1: enemy,
		rectangle2: player
	}) && enemy.isAttacking  && enemy.framesCurrent === 2){
		player.takeHit()
		// enemy.isAttacking = false
		console.log('enemy is attacking')
		// document.querySelector('#playerHealth').style.width = player.health + '%'
		gsap.to('#playerHealth', {
			width: player.health + '%'
		})
	}

	// 提前结束碰撞检测 of enemy
	if(enemy.isAttacking && enemy.framesCurrent === 2) enemy.isAttacking = false

	// end game based on health
	if(enemy.health <= 0 || player.health <= 0) {
		determineWinner({player, enemy, timerId})
	}
}

animate()

// 监听器
window.addEventListener('keydown', (event) => {
	if(!player.dead)
	switch (event.key) {
	// player control
	case 'd':
		keys.d.pressed = true
		player.lastKey = 'd'
		break
	case 'a':
		keys.a.pressed = true
		player.lastKey = 'a'
		break
	case 'w':
		player.jump()		
		break
	case ' ':
		player.attack()
		break
	}
	if(!enemy.dead)
	switch (event.key) {
	// enemy control
	case 'ArrowRight':
		keys.ArrowRight.pressed = true
		enemy.lastKey = 'ArrowRight'
		break
	case 'ArrowLeft':
		keys.ArrowLeft.pressed = true
		enemy.lastKey = 'ArrowLeft'
		break
	case 'ArrowUp':
		enemy.jump()
		break
	case '0':
		enemy.attack()
		break
	}


	// console.log(event.key)
})

window.addEventListener('keyup', (event) => {
	// player
	switch (event.key) {
	case 'd':
		keys.d.pressed = false
		break
	case 'a':
		keys.a.pressed = false
		break
	}
	// enemy
	switch (event.key) {
		case 'ArrowLeft':
		keys.ArrowLeft.pressed = false
		break
	case 'ArrowRight':
		keys.ArrowRight.pressed = false
		break
	}
	// console.log(event.key)
})