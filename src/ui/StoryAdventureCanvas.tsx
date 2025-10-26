import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { StoryPanel } from './StoryPanel';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type WebTarget = {
  id: string;
  x: number;
  y: number;
  type: 'anchor' | 'platform' | 'goal';
  sprite?: Phaser.GameObjects.Sprite;
  active: boolean;
};

type WebConnection = {
  toX: number;
  toY: number;
  target: WebTarget;
  ropeLength: number;
  cut: boolean;
  line?: Phaser.GameObjects.Graphics;
};

const WEB_HIT_RADIUS = 26;
const WEB_SHOT_SCALE = 6;
const ROPE_STIFF_CORRECTION = 1.0;
const ROPE_DAMPING = 0.25;

type Platform = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type WebPoint = {
  x: number;
  y: number;
  id: string;
};

type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spike' | 'fire' | 'ice' | 'electric' | 'void';
};

type CalcQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  actionType: 'jump' | 'web';
  concept: string;
  hint: string;
  storyContext: string;
};

type AdventureScene = {
  id: string;
  name: string;
  chapter: number;
  description: string;
  storyContext: string;
  background: string;
  platforms: Platform[];
  webPoints: WebPoint[];
  obstacles: Obstacle[];
  goal: { x: number; y: number };
  question: CalcQuestion;
};

// ============================================================================
// GAME DATA
// ============================================================================

const SCENE_DATA: AdventureScene[] = [
  {
    id: 'ch1-s1',
    name: 'The Great Gap',
    chapter: 1,
    description: 'Cross the entrance gap',
    storyContext: 'You arrive at the Haunted Mansion. A vast gap blocks your path to the crown.',
    background: '/scene-ch1-s1-background.png',
    platforms: [
      { x: 50, y: 550, width: 200, height: 20 },
      { x: 550, y: 550, width: 200, height: 20 }
    ],
    webPoints: [
      { x: 400, y: 200, id: 'wp1' }
    ],
    obstacles: [
      { x: 300, y: 520, width: 20, height: 30, type: 'spike' },
      { x: 450, y: 520, width: 20, height: 30, type: 'spike' }
    ],
    goal: { x: 650, y: 500 },
    question: {
      id: 'q1',
      question: 'What is the derivative of x²?',
      options: ['2x', 'x', '2', 'x²'],
      correctIndex: 0,
      actionType: 'jump',
      concept: 'Power Rule',
      hint: 'Use the power rule: d/dx(xⁿ) = n·xⁿ⁻¹',
      storyContext: 'To calculate your jump trajectory, you need the derivative!'
    }
  },
  {
    id: 'ch1-s2',
    name: 'The Chandelier Crossing',
    chapter: 1,
    description: 'Swing across the grand hall',
    storyContext: 'A magnificent chandelier hangs above. Use your web to swing across!',
    background: '/scene-ch1-s2-background.png',
    platforms: [
      { x: 50, y: 550, width: 150, height: 20 },
      { x: 650, y: 450, width: 150, height: 20 }
    ],
    webPoints: [
      { x: 400, y: 150, id: 'wp1' },
      { x: 500, y: 200, id: 'wp2' }
    ],
    obstacles: [
      { x: 200, y: 480, width: 30, height: 20, type: 'fire' },
      { x: 500, y: 380, width: 30, height: 20, type: 'fire' }
    ],
    goal: { x: 700, y: 400 },
    question: {
      id: 'q2',
      question: 'What is sin(30°)?',
      options: ['0.5', '0.866', '1', '0.707'],
      correctIndex: 0,
      actionType: 'web',
      concept: 'Trigonometry',
      hint: 'sin(30°) is a special angle value',
      storyContext: 'To aim your web correctly, calculate the sine!'
    }
  },
  {
    id: 'ch1-s3',
    name: 'The Locked Door',
    chapter: 1,
    description: 'Solve derivative puzzles to open the door',
    storyContext: 'A massive door of calculus runes blocks the path. Solve derivative challenges to unlock it.',
    background: '/scene-ch1-s3-background.png',
    platforms: [
      { x: 120, y: 520, width: 140, height: 20 },
      { x: 320, y: 460, width: 120, height: 20 },
      { x: 520, y: 420, width: 120, height: 20 },
      { x: 700, y: 380, width: 100, height: 20 }
    ],
    webPoints: [
      { x: 300, y: 220, id: 'wp1' },
      { x: 520, y: 180, id: 'wp2' }
    ],
    obstacles: [
      { x: 250, y: 440, width: 25, height: 20, type: 'electric' },
      { x: 450, y: 400, width: 25, height: 20, type: 'electric' }
    ],
    goal: { x: 720, y: 360 },
    question: {
      id: 'q1-3',
      question: 'd/dx(x^3 + 2x^2) = ?',
      options: ['3x^2 + 4x', '3x^2 + 2x', 'x^2 + 4x', '5x^2'],
      correctIndex: 0,
      actionType: 'jump',
      concept: 'Power rule (sum of terms)',
      hint: 'Differentiate each term and add the results',
      storyContext: 'Each lock responds to a derivative. Get them all to open the door.'
    }
  },
  {
    id: 'ch2-s1',
    name: 'The Towering Shelves',
    chapter: 2,
    description: 'Climb the library shelves',
    storyContext: 'Ancient books tower above. Calculate to reach the top shelf!',
    background: '/scene-ch2-s1-background.png',
    platforms: [
      { x: 50, y: 550, width: 150, height: 20 },
      { x: 300, y: 450, width: 150, height: 20 },
      { x: 550, y: 350, width: 150, height: 20 }
    ],
    webPoints: [
      { x: 400, y: 250, id: 'wp1' }
    ],
    obstacles: [
      { x: 180, y: 430, width: 20, height: 20, type: 'ice' },
      { x: 380, y: 330, width: 20, height: 20, type: 'ice' }
    ],
    goal: { x: 600, y: 300 },
    question: {
      id: 'q3',
      question: 'What is ∫x dx?',
      options: ['x²/2 + C', 'x² + C', '2x + C', 'x + C'],
      correctIndex: 0,
      actionType: 'jump',
      concept: 'Integration',
      hint: 'Reverse the power rule for integration',
      storyContext: 'Integration will help you accumulate enough height!'
    }
  },
  {
    id: 'ch2-s2',
    name: 'The Ancient Scroll',
    chapter: 2,
    description: 'Integration web puzzle to reach the scroll',
    storyContext: 'An ancient scroll floats behind shifting equations. Integrate your way across!',
    background: '/scene-ch2-s2-background.png',
    platforms: [
      { x: 160, y: 520, width: 120, height: 20 },
      { x: 360, y: 440, width: 120, height: 20 },
      { x: 560, y: 360, width: 120, height: 20 }
    ],
    webPoints: [
      { x: 420, y: 260, id: 'wp1' },
      { x: 620, y: 180, id: 'wp2' }
    ],
    obstacles: [
      { x: 300, y: 400, width: 30, height: 20, type: 'void' },
      { x: 500, y: 320, width: 30, height: 20, type: 'void' }
    ],
    goal: { x: 640, y: 340 },
    question: {
      id: 'q2-2',
      question: '∫ 3x^2 dx = ?',
      options: ['x^3 + C', '3x^3 + C', '6x + C', 'x^2 + C'],
      correctIndex: 0,
      actionType: 'web',
      concept: 'Antiderivatives',
      hint: 'Use power rule for integrals',
      storyContext: 'The scroll unlocks with the correct antiderivative.'
    }
  },
  {
    id: 'ch3-s1',
    name: 'The Precipice',
    chapter: 3,
    description: 'Navigate the narrow ledge',
    storyContext: 'A treacherous ledge with a deep abyss below. Precision is key!',
    background: '/scene-ch3-s1-background.png',
    platforms: [
      { x: 50, y: 550, width: 100, height: 20 },
      { x: 350, y: 500, width: 100, height: 20 },
      { x: 650, y: 450, width: 100, height: 20 }
    ],
    webPoints: [
      { x: 250, y: 300, id: 'wp1' },
      { x: 550, y: 300, id: 'wp2' }
    ],
    obstacles: [
      { x: 200, y: 480, width: 20, height: 20, type: 'void' },
      { x: 500, y: 430, width: 20, height: 20, type: 'void' }
    ],
    goal: { x: 700, y: 400 },
    question: {
      id: 'q4',
      question: 'What is lim(x→0) sin(x)/x?',
      options: ['1', '0', '∞', 'undefined'],
      correctIndex: 0,
      actionType: 'web',
      concept: 'Limits',
      hint: 'This is a fundamental limit',
      storyContext: 'As you approach the limit, calculate carefully!'
    }
  },
  {
    id: 'ch4-s1',
    name: 'The Throne Room',
    chapter: 4,
    description: 'Claim the Derivative Crown',
    storyContext: 'The Derivative Crown awaits! One final challenge stands before you!',
    background: '/scene-ch4-s1-background.png',
    platforms: [
      { x: 50, y: 550, width: 150, height: 20 },
      { x: 300, y: 450, width: 150, height: 20 },
      { x: 550, y: 500, width: 200, height: 20 }
    ],
    webPoints: [
      { x: 400, y: 200, id: 'wp1' },
      { x: 600, y: 250, id: 'wp2' }
    ],
    obstacles: [
      { x: 200, y: 430, width: 30, height: 20, type: 'fire' },
      { x: 450, y: 480, width: 30, height: 20, type: 'electric' }
    ],
    goal: { x: 650, y: 450 },
    question: {
      id: 'q5',
      question: 'What is d/dx(eˣ)?',
      options: ['eˣ', 'xeˣ⁻¹', 'ln(x)', '1/x'],
      correctIndex: 0,
      actionType: 'jump',
      concept: 'Exponential Derivatives',
      hint: 'The exponential function is its own derivative',
      storyContext: 'Master this final derivative to claim victory!'
    }
  }
];

// ============================================================================
// PHASER SCENE
// ============================================================================

class WebSwingingScene extends Phaser.Scene {
  private spider!: Phaser.Physics.Arcade.Sprite;
  private targets: WebTarget[] = [];
  private activeWeb: WebConnection | null = null;
  private lastPointerWasRightClick = false;
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private trajectoryGraphics!: Phaser.GameObjects.Graphics;
  private webGraphics!: Phaser.GameObjects.Graphics;
  private webs = 5;
  private cuts = 3;
  private score = 0;
  private currentGravity = 800;
  private sceneData!: AdventureScene;
  private sceneIndex = 0;
  private uiText!: Phaser.GameObjects.Text;
  private goalSprite!: Phaser.GameObjects.Sprite;
  private platforms: Phaser.Physics.Arcade.StaticGroup | null = null;

  constructor() {
    super({ key: 'WebSwingingScene' });
  }

  init(data: { sceneIndex?: number }) {
    this.sceneIndex = data.sceneIndex || 0;
    this.sceneData = SCENE_DATA[this.sceneIndex];
  }

  create() {
    // Create background image
    this.createBackground();

    this.trajectoryGraphics = this.add.graphics();
    this.trajectoryGraphics.setDepth(200);
    this.webGraphics = this.add.graphics();
    this.webGraphics.setDepth(110);

    this.platforms = this.physics.add.staticGroup();
    this.sceneData.platforms.forEach(p => {
      const rect = this.add.rectangle(p.x + p.width/2, p.y + p.height/2, p.width, p.height, 0x8B4513);
      this.physics.add.existing(rect, true);
      (rect.body as Phaser.Physics.Arcade.StaticBody).setOffset(-p.width/2, -p.height/2);
      this.platforms!.add(rect);
    });

    this.spider = this.physics.add.sprite(150, 450, '');
    this.spider.setDisplaySize(40, 40);
    this.spider.setCircle(20);
    this.spider.setBounce(0.2);
    this.spider.setCollideWorldBounds(true);
    this.physics.world.gravity.y = this.currentGravity;

    // Create improved spider texture
    this.createSpiderTexture();

    (this.spider.body as Phaser.Physics.Arcade.Body).setDrag(0.5, 0.5);

    this.physics.add.collider(this.spider, this.platforms);

    this.createWebTargets();
    this.createObstacles();
    this.createGoal();

    // Add obstacle collision detection
    this.sceneData.obstacles.forEach((obstacle, index) => {
      const obstacleSprite = this.children.list.find(child => 
        child instanceof Phaser.GameObjects.Sprite && 
        child.texture && 
        child.texture.key === `${obstacle.type}-${index}`
      ) as Phaser.GameObjects.Sprite;
      
      if (obstacleSprite) {
        this.physics.add.existing(obstacleSprite, true);
        this.physics.add.collider(this.spider, obstacleSprite, () => {
          this.handleObstacleCollision(obstacle.type);
        });
      }
    });

    this.uiText = this.add.text(10, 10, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#000000aa',
      padding: { x: 10, y: 5 }
    });
    this.uiText.setDepth(1000);
    this.updateUI();

    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('pointerup', this.onPointerUp, this);
    this.input.on('pointerout', this.onPointerOut, this);

    window.addEventListener('spidercalc-answer', this.handleAnswer as EventListener);
    window.addEventListener('web-swinging-set-scene', this.handleExternalSetScene as EventListener);

    window.dispatchEvent(new CustomEvent('request-question', {
      detail: { question: this.sceneData.question }
    }));
  }

  private handleExternalSetScene = (e: CustomEvent) => {
    const idx = e.detail?.sceneIndex;
    if (typeof idx === 'number' && idx >= 0 && idx < SCENE_DATA.length) {
      this.scene.restart({ sceneIndex: idx });
    }
  };

  private createBackground() {
    // Create background image
    const bgImage = this.add.image(400, 300, this.sceneData.background);
    bgImage.setDisplaySize(800, 600);
    bgImage.setDepth(-100);
    
    // Add overlay for better contrast
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.2);
    overlay.setDepth(-99);
  }

  private createSpiderTexture() {
    const graphics = this.add.graphics();
    
    // Spider body (more detailed)
    graphics.fillStyle(0x8b5cf6, 1);
    graphics.fillCircle(20, 20, 12);
    
    // Spider head
    graphics.fillStyle(0x6d28d9, 1);
    graphics.fillCircle(20, 12, 6);
    
    // Spider legs (8 legs)
    graphics.lineStyle(4, 0x8b5cf6, 1);
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      const startX = 20 + Math.cos(angle) * 10;
      const startY = 20 + Math.sin(angle) * 10;
      const endX = 20 + Math.cos(angle) * 18;
      const endY = 20 + Math.sin(angle) * 18;
      
      graphics.beginPath();
      graphics.moveTo(startX, startY);
      graphics.lineTo(endX, endY);
      graphics.strokePath();
    }
    
    // Spider eyes
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(17, 10, 2);
    graphics.fillCircle(23, 10, 2);
    
    graphics.generateTexture('spider', 40, 40);
    graphics.destroy();
    this.spider.setTexture('spider');
  }

  private createWebTargets() {
    this.sceneData.webPoints.forEach((wp, i) => {
      const sprite = this.add.sprite(wp.x, wp.y, '');
      
      // Create enhanced web anchor visual
      const g = this.add.graphics();
      
      // Outer glow ring
      g.fillStyle(0xffd700, 0.3);
      g.fillCircle(0, 0, 25);
      
      // Main anchor circle
      g.fillStyle(0xffd700, 1);
      g.fillCircle(0, 0, 18);
      
      // Inner highlight
      g.fillStyle(0xffff00, 1);
      g.fillCircle(0, 0, 12);
      
      // Border
      g.lineStyle(3, 0xffaa00, 1);
      g.strokeCircle(0, 0, 18);
      
      // Web symbol in center
      g.lineStyle(2, 0x8b5cf6, 1);
      g.strokeCircle(0, 0, 8);
      g.lineStyle(1, 0x8b5cf6, 1);
      g.lineBetween(-6, -6, 6, 6);
      g.lineBetween(-6, 6, 6, -6);
      
      g.generateTexture('anchor', 50, 50);
      g.destroy();
      
      sprite.setTexture('anchor');
      sprite.setInteractive();
      
      // Enhanced pulsing animation
      this.tweens.add({
        targets: sprite,
        scale: { from: 1.0, to: 1.4 },
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      // Add rotation animation
      this.tweens.add({
        targets: sprite,
        angle: { from: 0, to: 360 },
        duration: 3000,
        repeat: -1,
        ease: 'Linear'
      });

      this.targets.push({
        id: wp.id,
        x: wp.x,
        y: wp.y,
        type: 'anchor',
        sprite: sprite,
        active: true
      });
    });
  }

  private createObstacles() {
    this.sceneData.obstacles.forEach((obstacle, index) => {
      const obstacleSprite = this.add.sprite(obstacle.x, obstacle.y, '');
      
      // Create obstacle texture based on type
      const g = this.add.graphics();
      
      switch (obstacle.type) {
        case 'spike':
          // Spike obstacle
          g.fillStyle(0xff0000, 1);
          g.fillTriangle(0, -obstacle.height/2, -obstacle.width/2, obstacle.height/2, obstacle.width/2, obstacle.height/2);
          g.lineStyle(2, 0xcc0000, 1);
          g.strokeTriangle(0, -obstacle.height/2, -obstacle.width/2, obstacle.height/2, obstacle.width/2, obstacle.height/2);
          g.generateTexture(`spike-${index}`, obstacle.width, obstacle.height);
          break;
          
        case 'fire':
          // Fire obstacle
          g.fillStyle(0xff4500, 1);
          g.fillRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
          g.lineStyle(2, 0xff0000, 1);
          g.strokeRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
          g.generateTexture(`fire-${index}`, obstacle.width, obstacle.height);
          break;
          
        case 'ice':
          // Ice obstacle
          g.fillStyle(0x87ceeb, 1);
          g.fillRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
          g.lineStyle(2, 0x4682b4, 1);
          g.strokeRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
          g.generateTexture(`ice-${index}`, obstacle.width, obstacle.height);
          break;
          
        case 'electric':
          // Electric obstacle
          g.fillStyle(0x00ffff, 1);
          g.fillRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
          g.lineStyle(2, 0x0080ff, 1);
          g.strokeRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
          g.generateTexture(`electric-${index}`, obstacle.width, obstacle.height);
          break;
          
        case 'void':
          // Void obstacle
          g.fillStyle(0x000000, 0.8);
          g.fillRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
          g.lineStyle(2, 0x800080, 1);
          g.strokeRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height);
          g.generateTexture(`void-${index}`, obstacle.width, obstacle.height);
          break;
      }
      
      g.destroy();
      obstacleSprite.setTexture(`${obstacle.type}-${index}`);
      obstacleSprite.setDisplaySize(obstacle.width, obstacle.height);
      obstacleSprite.setDepth(120);
      
      // Add obstacle-specific animations
      this.addObstacleAnimation(obstacleSprite, obstacle.type);
    });
  }

  private addObstacleAnimation(sprite: Phaser.GameObjects.Sprite, type: string) {
    switch (type) {
      case 'spike':
        // Spikes pulse red
        this.tweens.add({
          targets: sprite,
          tint: 0xff6666,
          duration: 500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        break;
        
      case 'fire':
        // Fire flickers
        this.tweens.add({
          targets: sprite,
          alpha: 0.7,
          duration: 200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        break;
        
      case 'ice':
        // Ice sparkles
        this.tweens.add({
          targets: sprite,
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        break;
        
      case 'electric':
        // Electric crackles
        this.tweens.add({
          targets: sprite,
          tint: 0xffffff,
          duration: 100,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
        break;
        
      case 'void':
        // Void swirls
        this.tweens.add({
          targets: sprite,
          angle: 360,
          duration: 2000,
          repeat: -1,
          ease: 'Linear'
        });
        break;
    }
  }

  private createGoal() {
    const g = this.sceneData.goal;
    this.goalSprite = this.add.sprite(g.x, g.y, '');
    
    // Create enhanced goal visual
    const graphics = this.add.graphics();
    
    // Outer glow
    graphics.fillStyle(0x00ff00, 0.3);
    graphics.fillCircle(0, 0, 35);
    
    // Main goal circle
    graphics.fillStyle(0x00ff00, 1);
    graphics.fillCircle(0, 0, 25);
    
    // Inner highlight
    graphics.fillStyle(0x00ff80, 1);
    graphics.fillCircle(0, 0, 15);
    
    // Border
    graphics.lineStyle(4, 0x00aa00, 1);
    graphics.strokeCircle(0, 0, 25);
    
    // Crown symbol in center
    graphics.fillStyle(0xffd700, 1);
    graphics.fillTriangle(0, -8, -6, 4, 6, 4);
    graphics.lineStyle(2, 0xffaa00, 1);
    graphics.strokeTriangle(0, -8, -6, 4, 6, 4);
    
    graphics.generateTexture('goal', 70, 70);
    graphics.destroy();
    
    this.goalSprite.setTexture('goal');
    this.goalSprite.setDepth(100);

    // Enhanced goal text
    const goalText = this.add.text(g.x, g.y - 50, '🎯 GOAL', {
      fontSize: '18px',
      color: '#00ff00',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    goalText.setDepth(101);

    // Goal pulsing animation
    this.tweens.add({
      targets: this.goalSprite,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Goal text pulsing
    this.tweens.add({
      targets: goalText,
      alpha: 0.7,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.targets.push({
      id: 'goal',
      x: g.x,
      y: g.y,
      type: 'goal',
      sprite: this.goalSprite,
      active: true
    });
  }

  private handleAnswer = (event: CustomEvent) => {
    const { correct, actionType } = event.detail;
    
    this.currentGravity = correct ? 600 : 1000;
    this.physics.world.gravity.y = this.currentGravity;

    if (this.activeWeb && !this.activeWeb.cut) {
      this.activeWeb.ropeLength *= correct ? 0.92 : 1.08;
    }

    this.score += correct ? 100 : -50;
    this.updateUI();

    const feedbackText = this.add.text(400, 100, correct ? 'Correct! ✓' : 'Wrong! ✗', {
      fontSize: '32px',
      color: correct ? '#00ff00' : '#ff0000',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.tweens.add({
      targets: feedbackText,
      alpha: 0,
      y: 50,
      duration: 1500,
      onComplete: () => feedbackText.destroy()
    });
  };

  private attachWeb(target: WebTarget) {
    const dx = target.x - this.spider.x;
    const dy = target.y - this.spider.y;
    const len = Math.hypot(dx, dy);

    this.activeWeb?.line?.destroy();

    const body = this.spider.body as Phaser.Physics.Arcade.Body;
    const currentVelX = body.velocity.x;
    const currentVelY = body.velocity.y;

    this.activeWeb = {
      toX: target.x,
      toY: target.y,
      target,
      ropeLength: Math.max(40, len),
      cut: false,
      line: this.add.graphics().setDepth(150)
    };

    this.webs = Math.max(0, this.webs - 1);
    this.score += 50;
    this.updateUI();
  }

  private detachWeb() {
    if (this.activeWeb) {
      this.activeWeb.line?.destroy();
      this.activeWeb = null;
    }
  }

  private enforceRopeConstraint(dtSec: number) {
    if (!this.activeWeb || this.activeWeb.cut) return;

    const body = this.spider.body as Phaser.Physics.Arcade.Body;
    const ax = this.activeWeb.toX;
    const ay = this.activeWeb.toY;
    const sx = this.spider.x;
    const sy = this.spider.y;
    let rx = sx - ax;
    let ry = sy - ay;
    let d = Math.hypot(rx, ry);

    if (d === 0) { rx = 0; ry = 1; d = 1; }
    const rhatx = rx / d;
    const rhaty = ry / d;

    const L = this.activeWeb.ropeLength;
    if (d > L) {
      const targetX = ax + rhatx * L;
      const targetY = ay + rhaty * L;
      const nx = Phaser.Math.Linear(sx, targetX, ROPE_STIFF_CORRECTION);
      const ny = Phaser.Math.Linear(sy, targetY, ROPE_STIFF_CORRECTION);
      this.spider.setPosition(nx, ny);

      const vx = body.velocity.x;
      const vy = body.velocity.y;
      const vr = vx * rhatx + vy * rhaty;
      const tx = vx - vr * rhatx;
      const ty = vy - vr * rhaty;
      const dampVr = vr * (1 - ROPE_DAMPING);

      body.setVelocity(tx + dampVr * rhatx, ty + dampVr * rhaty);
    }
    
    body.setAcceleration(0, 0);

    this.activeWeb.line!.clear();
    
    // Enhanced web rope visualization
    this.activeWeb.line!.lineStyle(4, 0x8b5cf6, 1);
    this.activeWeb.line!.lineBetween(this.spider.x, this.spider.y, ax, ay);
    
    // Add web rope glow effect
    this.activeWeb.line!.lineStyle(6, 0x8b5cf6, 0.3);
    this.activeWeb.line!.lineBetween(this.spider.x, this.spider.y, ax, ay);
  }

  private onPointerDown(pointer: Phaser.Input.Pointer) {
    if (pointer.leftButtonDown() && this.webs > 0) {
      this.isDragging = true;
      this.dragStartX = pointer.x;
      this.dragStartY = pointer.y;
    }
    else if (pointer.rightButtonDown()) {
      this.onRightClick(pointer);
    }
  }

  private onPointerMove(pointer: Phaser.Input.Pointer) {
    if (this.isDragging) {
      const dx = pointer.x - this.dragStartX;
      const dy = pointer.y - this.dragStartY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const power = Math.min(distance / 5, 200);

      this.drawTrajectory(angle, power);
    }
  }

  private onPointerUp(pointer: Phaser.Input.Pointer) {
    if (this.isDragging && pointer.leftButtonReleased()) {
      this.isDragging = false;
      this.trajectoryGraphics.clear();

      const dx = pointer.x - this.dragStartX;
      const dy = pointer.y - this.dragStartY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const power = Math.min(distance / 5, 200);

      this.shootWeb(angle, power);
    }
  }

  private onPointerOut() {
    if (this.isDragging) {
      this.isDragging = false;
      this.trajectoryGraphics.clear();
    }
  }

  private onRightClick(pointer: Phaser.Input.Pointer) {
    this.lastPointerWasRightClick = true;

    if (this.cuts <= 0) return;

    if (this.activeWeb && !this.activeWeb.cut) {
      const d = this.pointToLineDistance(
        pointer.x, pointer.y,
        this.spider.x, this.spider.y,
        this.activeWeb.toX, this.activeWeb.toY
      );
      if (d < 24) {
        this.activeWeb.cut = true;
        this.cuts--;
        this.detachWeb();
        this.updateUI();
        return;
      }
    }

    this.cutNearestWeb(pointer.x, pointer.y);
  }

  private drawTrajectory(angle: number, power: number) {
    this.trajectoryGraphics.clear();
    this.trajectoryGraphics.lineStyle(2, 0xffff00, 0.6);

    const startX = this.spider.x;
    const startY = this.spider.y;
    const g = this.physics.world.gravity.y;
    const v0 = power * WEB_SHOT_SCALE;

    let hitTarget: WebTarget | null = null;
    let hitX = 0, hitY = 0;

    for (let t = 0; t <= 2.0; t += 0.05) {
      const x = startX + v0 * Math.cos(angle) * t;
      const y = startY + v0 * Math.sin(angle) * t + 0.5 * g * t * t;

      if (t === 0) this.trajectoryGraphics.moveTo(x, y);
      else this.trajectoryGraphics.lineTo(x, y);

      if (!hitTarget) {
        for (const target of this.targets) {
          const dist = Math.hypot(x - target.x, y - target.y);
          if (dist < WEB_HIT_RADIUS && target.active && (target.type === 'anchor' || target.type === 'goal')) {
            hitTarget = target; hitX = x; hitY = y; break;
          }
        }
      }
      if (hitTarget) break;
    }

    this.trajectoryGraphics.strokePath();

    if (hitTarget) {
      this.trajectoryGraphics.fillStyle(0xff0000, 0.9);
      this.trajectoryGraphics.fillCircle(hitX, hitY, 5);
    }
  }

  private shootWeb(angle: number, power: number) {
    const startX = this.spider.x;
    const startY = this.spider.y;
    const g = this.physics.world.gravity.y;
    const v0 = power * WEB_SHOT_SCALE;

    let hitTarget: WebTarget | null = null;

    for (let t = 0; t <= 2.0; t += 0.05) {
      const x = startX + v0 * Math.cos(angle) * t;
      const y = startY + v0 * Math.sin(angle) * t + 0.5 * g * t * t;

      for (const target of this.targets) {
        if (!target.active) continue;
        if (target.type !== 'anchor' && target.type !== 'goal') continue;
        const dist = Math.hypot(x - target.x, y - target.y);
        if (dist < WEB_HIT_RADIUS) { hitTarget = target; break; }
      }
      if (hitTarget) break;
    }

    this.spider.setVelocity(v0 * Math.cos(angle), v0 * Math.sin(angle));

    if (hitTarget && this.webs > 0) {
      this.detachWeb();
      this.attachWeb(hitTarget);

      if (hitTarget.type === 'goal') {
        this.time.delayedCall(500, () => this.completeLevel());
      }
    }
  }

  private cutNearestWeb(x: number, y: number) {
    if (this.activeWeb && !this.activeWeb.cut) {
      const dist = this.pointToLineDistance(
        x, y,
        this.spider.x, this.spider.y,
        this.activeWeb.toX, this.activeWeb.toY
      );

      if (dist < 30) {
        this.activeWeb.cut = true;
        this.cuts--;
        this.detachWeb();
        this.updateUI();
      }
    }
  }

  private pointToLineDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private updateUI() {
    this.uiText.setText(
      `Webs: ${this.webs} | Cuts: ${this.cuts} | Score: ${this.score}\nScene: ${this.sceneData.name}`
    );

    window.dispatchEvent(new CustomEvent('web-swinging-stats-update', {
      detail: {
        webs: this.webs,
        cuts: this.cuts,
        currentScene: this.sceneData.name,
        sceneIndex: this.sceneIndex
      }
    }));
  }

  private completeLevel() {
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
    overlay.setDepth(999);

    const victoryText = this.add.text(400, 250, 'Level Complete!', {
      fontSize: '48px',
      color: '#00ff00',
      fontStyle: 'bold'
    }).setOrigin(0.5).setDepth(1000);

    const scoreText = this.add.text(400, 320, `Final Score: ${this.score}`, {
      fontSize: '32px',
      color: '#ffffff'
    }).setOrigin(0.5).setDepth(1000);

    this.time.delayedCall(3000, () => {
      const nextIndex = this.sceneIndex + 1;
      if (nextIndex < SCENE_DATA.length) {
        this.scene.restart({ sceneIndex: nextIndex });
      } else {
        const finalText = this.add.text(400, 400, 'Game Complete!', {
          fontSize: '36px',
          color: '#ffd700',
          fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(1000);
      }
    });
  }

  update(time: number, delta: number) {
    const dtSec = delta / 1000;

    this.webGraphics.clear();

    this.enforceRopeConstraint(dtSec);

    const dist = Math.hypot(this.spider.x - this.sceneData.goal.x, this.spider.y - this.sceneData.goal.y);
    if (dist < 30) {
      this.completeLevel();
    }
  }

  private handleObstacleCollision(obstacleType: string) {
    console.log(`💥 Spider hit ${obstacleType} obstacle!`);
    
    // Different effects based on obstacle type
    switch (obstacleType) {
      case 'spike':
        this.score -= 50;
        this.showObstacleEffect('💀 Spike Damage!', 0xff0000);
        this.spider.setTint(0xff0000);
        setTimeout(() => this.spider.clearTint(), 500);
        break;
        
      case 'fire':
        this.score -= 30;
        this.showObstacleEffect('🔥 Fire Burn!', 0xff4500);
        this.spider.setTint(0xff4500);
        setTimeout(() => this.spider.clearTint(), 1000);
        break;
        
      case 'ice':
        this.score -= 20;
        this.showObstacleEffect('❄️ Ice Slow!', 0x87ceeb);
        this.spider.setTint(0x87ceeb);
        setTimeout(() => this.spider.clearTint(), 1500);
        break;
        
      case 'electric':
        this.score -= 40;
        this.showObstacleEffect('⚡ Electric Shock!', 0x00ffff);
        this.spider.setTint(0x00ffff);
        setTimeout(() => this.spider.clearTint(), 300);
        break;
        
      case 'void':
        this.score -= 100;
        this.showObstacleEffect('🕳️ Void Damage!', 0x800080);
        this.spider.setTint(0x800080);
        setTimeout(() => this.spider.clearTint(), 2000);
        break;
    }
    
    this.updateUI();
  }

  private showObstacleEffect(text: string, color: number) {
    const effectText = this.add.text(400, 200, text, {
      fontSize: '24px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);
    effectText.setTint(color);
    effectText.setDepth(1000);

    this.tweens.add({
      targets: effectText,
      alpha: 0,
      y: 150,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => effectText.destroy()
    });
  }

  destroy() {
    window.removeEventListener('spidercalc-answer', this.handleAnswer as EventListener);
    window.removeEventListener('web-swinging-set-scene', this.handleExternalSetScene as EventListener);
  }
}

// ============================================================================
// REACT COMPONENT
// ============================================================================

export function StoryAdventureCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<CalcQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameStats, setGameStats] = useState({
    webs: 5,
    cuts: 3,
    currentScene: '',
    sceneIndex: 0
  });
  
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'web-swinging-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 800, x: 0 },
          debug: false
        }
      },
      scene: WebSwingingScene,
      backgroundColor: '#000000'
    };

    gameRef.current = new Phaser.Game(config);

    const handleQuestionRequest = (e: Event) => {
      const event = e as CustomEvent;
      setCurrentQuestion(event.detail.question);
    };

    const handleGameStats = (e: Event) => {
      const event = e as CustomEvent;
      if (event.detail) {
        setGameStats(event.detail);
      }
    };

    window.addEventListener('request-question', handleQuestionRequest);
    window.addEventListener('web-swinging-stats-update', handleGameStats);
    
    return () => {
      window.removeEventListener('request-question', handleQuestionRequest);
      window.removeEventListener('web-swinging-stats-update', handleGameStats);
      gameRef.current?.destroy(true);
    };
  }, []);

  const handleAnswer = (index: number) => {
    if (!currentQuestion) return;

    const correct = index === currentQuestion.correctIndex;
    setSelectedAnswer(index);

    window.dispatchEvent(new CustomEvent('spidercalc-answer', {
      detail: {
        correct,
        actionType: currentQuestion.actionType
      }
    }));

    setTimeout(() => {
      setSelectedAnswer(null);
    }, 1500);
  };
  
  return (
    <div style={{
      display: 'flex',
      gap: '20px',
      padding: '20px',
      backgroundColor: '#0f0f23',
      minHeight: '100vh',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Game Canvas */}
      <div style={{ flex: 1 }}>
        <div id="web-swinging-container" style={{
          border: '3px solid #8b5cf6',
          borderRadius: '8px',
          overflow: 'hidden'
        }} />
        
        {/* Spider-Man Style HUD + Navigation */}
        <div style={{
          marginTop: '20px',
          padding: '20px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)',
          borderRadius: '8px',
          border: '2px solid #8b5cf6',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)'
        }}>
          <h3 style={{ 
            margin: '0 0 15px 0', 
            color: '#ffd700',
            fontSize: '18px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            🕷️ SPIDER-MAN WEB-SWINGING
          </h3>
          
          {/* Game Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {gameStats.webs}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>Webs</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b' }}>
                {gameStats.cuts}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>Cuts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffd700' }}>
                {score}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>Score</div>
            </div>
          </div>

          {/* Controls Guide */}
          <div style={{
            padding: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            fontSize: '13px'
          }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#8b5cf6', fontSize: '16px' }}>🖱️ </span>
              <strong style={{ color: '#fff' }}>Left Drag:</strong> 
              <span style={{ color: '#aaa' }}> Aim web trajectory</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ color: '#ff6b6b', fontSize: '16px' }}>✂️ </span>
              <strong style={{ color: '#fff' }}>Right Click:</strong> 
              <span style={{ color: '#aaa' }}> Cut rope</span>
            </div>
            <div>
              <span style={{ color: '#00ff00', fontSize: '16px' }}>🎯 </span>
              <strong style={{ color: '#fff' }}>Goal:</strong> 
              <span style={{ color: '#aaa' }}> Reach green target</span>
            </div>
          </div>

          {gameStats.currentScene && (
            <div style={{
              marginTop: '12px',
              padding: '8px',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              borderRadius: '4px',
              textAlign: 'center',
              fontSize: '12px',
              color: '#8b5cf6',
              fontWeight: 'bold'
            }}>
              📍 {gameStats.currentScene}
            </div>
          )}

          {/* Scene navigation (7 scenes, 4 chapters) */}
          <div style={{
            marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <button
              onClick={() => {
                const idx = Math.max(0, (gameStats.sceneIndex || 0) - 1)
                window.dispatchEvent(new CustomEvent('web-swinging-set-scene', { detail: { sceneIndex: idx } }))
              }}
              className="btn"
              style={{ padding: '6px 10px' }}
            >
              ⬅️ Prev
            </button>

            <div style={{ fontSize: '12px', color: '#aaa' }}>
              Scene {((gameStats.sceneIndex || 0) + 1)} / 7
            </div>

            <button
              onClick={() => {
                const idx = Math.min(6, (gameStats.sceneIndex || 0) + 1)
                window.dispatchEvent(new CustomEvent('web-swinging-set-scene', { detail: { sceneIndex: idx } }))
              }}
              className="btn"
              style={{ padding: '6px 10px' }}
            >
              Next ➡️
            </button>
          </div>
        </div>
      </div>

      {/* Question Panel */}
      <div style={{
        width: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {currentQuestion ? (
          <>
            <div style={{
              padding: '20px',
              backgroundColor: '#1a1a2e',
              borderRadius: '8px',
              border: '2px solid #ffd700'
            }}>
              <div style={{
                display: 'inline-block',
                padding: '5px 15px',
                backgroundColor: currentQuestion.actionType === 'jump' ? '#00ff00' : '#00e5ff',
                color: '#000',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                marginBottom: '10px'
              }}>
                {currentQuestion.actionType === 'jump' ? '🦘 JUMP' : '🕸️ WEB'}
              </div>
              
              <p style={{
                fontSize: '14px',
                fontStyle: 'italic',
                color: '#ffd700',
                margin: '10px 0'
              }}>
                {currentQuestion.storyContext}
              </p>
            </div>

            <div style={{
              padding: '20px',
              backgroundColor: '#1a1a2e',
              borderRadius: '8px',
              border: '2px solid #8b5cf6'
            }}>
              <h3 style={{
                margin: '0 0 15px 0',
                color: '#8b5cf6',
                fontSize: '20px'
              }}>
                {currentQuestion.question}
              </h3>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    style={{
                      padding: '15px',
                      fontSize: '16px',
                      backgroundColor: 
                        selectedAnswer === index
                          ? index === currentQuestion.correctIndex
                            ? '#00ff00'
                            : '#ff0000'
                          : currentQuestion.actionType === 'jump'
                            ? '#00aa00'
                            : '#00a5b5',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: selectedAnswer === null ? 'pointer' : 'not-allowed',
                      fontWeight: 'bold',
                      transition: 'all 0.3s',
                      opacity: selectedAnswer !== null && selectedAnswer !== index ? 0.5 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (selectedAnswer === null) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.6)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div style={{
                marginTop: '15px',
                padding: '10px',
                backgroundColor: '#0f0f23',
                borderRadius: '5px',
                fontSize: '12px',
                color: '#aaa'
              }}>
                <strong>Concept:</strong> {currentQuestion.concept}
                <br />
                <strong>Hint:</strong> {currentQuestion.hint}
              </div>
            </div>

            <div style={{
              padding: '15px',
              backgroundColor: '#1a1a2e',
              borderRadius: '8px',
              border: '2px solid #ffd700',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#ffd700'
              }}>
                Score: {score}
              </div>
            </div>

            <div style={{
              padding: '15px',
              backgroundColor: '#1a1a2e',
              borderRadius: '8px',
              border: '2px solid #666'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#8b5cf6' }}>Action Legend</h4>
              <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                <p style={{ margin: '5px 0' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#00ff00',
                    borderRadius: '3px',
                    marginRight: '8px',
                    verticalAlign: 'middle'
                  }} />
                  <strong>Jump:</strong> Answer to leap across gaps
                </p>
                <p style={{ margin: '5px 0' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#00e5ff',
                    borderRadius: '3px',
                    marginRight: '8px',
                    verticalAlign: 'middle'
                  }} />
                  <strong>Web:</strong> Answer to enable web shooting
                </p>
                <p style={{ margin: '10px 0 5px 0', fontSize: '12px', color: '#aaa' }}>
                  ✓ Correct = Better physics!<br />
                  ✗ Wrong = Harder physics!
                </p>
              </div>
            </div>
          </>
        ) : (
          <div style={{
            padding: '40px',
            backgroundColor: '#1a1a2e',
            borderRadius: '8px',
            border: '2px solid #8b5cf6',
            textAlign: 'center'
          }}>
            <h2 style={{ color: '#8b5cf6', margin: '0 0 20px 0' }}>
              🕷️ SpiderCalc Adventure
            </h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
              Welcome, brave spider mathematician! Navigate through the Haunted Mansion
              of Functions to recover the legendary Derivative Crown!
            </p>
            <div style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#0f0f23',
              borderRadius: '5px',
              textAlign: 'left'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#ffd700' }}>Your Quest:</h3>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                📚 Chapter 1: The Entrance Hall<br />
                📚 Chapter 2: The Integral Library<br />
                📚 Chapter 3: The Chamber of Limits<br />
                📚 Chapter 4: The Throne Room
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
