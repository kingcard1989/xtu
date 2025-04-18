<template>
    <div style="position: relative;">
      <canvas ref="canvas" style="position: absolute; top: 0; left: 0; z-index: -1;" width="800" height="400"></canvas>
    <div ref="graphContainer" class="graph-container" style="position: absolute; top: 0; left: 0; z-index: 20;"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import axios from 'axios';

export default {
  data() {
    return {
      width: 1200,
      height: 600,
      linkDistance: 120,
      processedNodes: [], 
      processedLinks: [], 
      simulation: null,
      svg: null,
      particles: [],
      fireworkParticles: [],
      dustParticles: [],
      ripples: [],
      techRipples: [],
      mouse: { x: null, y: null },
      backgroundHue: 0,
      frameCount: 0,
      autoDrift: true,
    }
  },
  async mounted() {
    await this.initGraph();
    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas);
    this.animate();
    this.setupMouseEvents();
  },
  beforeUnmount() { 
    window.removeEventListener("resize", this.resizeCanvas);
  },
  methods: {
    async initGraph() {
      const response = await axios.get('http://localhost:1553/api/init-graph');
      this.resetGraph(response.data, '网络安全');
    },

    // 双击节点处理
    async handleNodeDoubleClick(node) {
      const nodeName = encodeURIComponent(node.properties.name);
      const response = await axios.get(`http://localhost:1553/api/expand-node/${nodeName}`);
      this.resetGraph(response.data, node.properties.name);
    },

    // 重置图谱数据
    resetGraph(data,centerNodeName) {
      // 清空旧数据
      this.processedNodes = [];
      this.processedLinks = [];
      
      // 转换节点
      this.processedNodes = data.nodes.map(node => ({
        ...node,
        x: this.width / 2 + (Math.random() - 0.5) * 100,
        y: this.height / 2 + (Math.random() - 0.5) * 100,
        fx: null,  // 新增固定坐标
        fy: null
      }));
      const centerNode = this.processedNodes.find(n => n.label === centerNodeName);
      if (centerNode) {
        centerNode.x = this.width / 2;
        centerNode.y = this.height / 2;
        centerNode.fx = this.width / 2; // 固定位置
        centerNode.fy = this.height / 2;
        centerNode.isCenter = true; // 添加中心节点标识
      }

      // 转换边
      this.processedLinks = data.links.map(link => ({
        source: link.source,
        target: link.target,
        label: link.label
      }));

      // 重启力导向模拟
      this.restartSimulation();
      this.renderGraph();
    },

    restartSimulation() {
      if (this.simulation) this.simulation.stop();
      
      this.simulation = d3.forceSimulation(this.processedNodes)
        .force('link', d3.forceLink(this.processedLinks)
          .id(d => d.id)
          .distance(this.linkDistance))
        .force('charge', d3.forceManyBody().strength(-400))
        .force('center', d3.forceCenter(this.width / 2, this.height / 2))
        .force('collision', d3.forceCollide().radius(40))
        // 新增边界约束力
        .force('bounds', () => {
          this.processedNodes.forEach(node => {
            if (!node.isCenter) {
              node.x = Math.max(30, Math.min(this.width - 30, node.x));
              node.y = Math.max(30, Math.min(this.height - 30, node.y));
            }
          });
        });

      this.simulation.on('tick', () => this.updateGraph());
    },

    // 渲染SVG元素
    renderGraph() {
      // 清空旧图形
      d3.select(this.$refs.graphContainer).select('svg').remove();
      
      // 创建新SVG
      this.svg = d3.select(this.$refs.graphContainer)
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height);

      // 绘制连线
      this.svg.append('g')
        .selectAll('line')
        .data(this.processedLinks)
        .join('line')
        .attr('stroke', '#33FF57')
        .attr('stroke-width', 2);

      // 绘制节点
      this.svg.append('g')
        .selectAll('circle')
        .data(this.processedNodes)
        .join('circle')
        .attr('r', 15)
        .attr('fill', this.getNodeColor)
        .call(this.dragHandler)
        .on('dblclick', (e, d) => this.handleNodeDoubleClick(d));

      // 绘制标签
      this.svg.append('g')
        .selectAll('text')
        .data(this.processedNodes)
        .join('text')
        .text(d => d.label)
        .attr('font-size', 16)
        .attr('font-family', '幼圆') // 使用幼圆字体
        .attr('dx', 15)
        .attr('dy', 4)
        .attr('fill', '#fff');
    },

    // 更新图形位置
    updateGraph() {
      this.svg.selectAll('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      this.svg.selectAll('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      this.svg.selectAll('text')
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    },

    // 节点拖拽处理（保持原逻辑）
    dragHandler(simulation) {
      return d3.drag()
        .on('start', (e) => {
          simulation.alphaTarget(0.3).restart();
          e.subject.fx = e.subject.x;
          e.subject.fy = e.subject.y;
        })
        .on('drag', (e) => {
          e.subject.fx = e.x;
          e.subject.fy = e.y;
        })
        .on('end', (e) => {
          if (!e.active) simulation.alphaTarget(0);
          e.subject.fx = null;
          e.subject.fy = null;
        });
    },
    // 节点颜色生成（保持原渐变逻辑）
    getNodeColor(d) {
      const gradient = this.svg.append('defs')
        .append('linearGradient')
        .attr('id', `grad-${d.id}`)
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '100%');

      gradient.append('stop').attr('offset', '0%').style('stop-color', '#FF5733');
      gradient.append('stop').attr('offset', '100%').style('stop-color', '#33FF57');

      return `url(#grad-${d.id})`;
    },
   
    setupMouseEvents() {
      const canvas = this.$refs.canvas;
      canvas.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
        this.techRipples.push(new Ripple(this.mouse.x, this.mouse.y));
        this.autoDrift = false;
      });

      canvas.addEventListener("mouseleave", () => {
        this.mouse.x = null;
        this.mouse.y = null;
        this.autoDrift = true;
      });

      canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  this.ripples.push(new Ripple(clickX, clickY, 0, 60, this.$refs.canvas));
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;
    const particle = new Particle(clickX, clickY, true, this.$refs.canvas); 
    particle.vx = Math.cos(angle) * speed;
    particle.vy = Math.sin(angle) * speed;
    this.fireworkParticles.push(particle);
  }
});
    },
    resizeCanvas() {
      const canvas = this.$refs.canvas;
      canvas.width = 1200;
      canvas.height = 600; 
      this.createParticles();
    },
    createParticles() {
  this.particles.length = 0;
  this.dustParticles.length = 0;

  const numParticles = this.adjustParticleCount();
  for (let i = 0; i < numParticles; i++) {
    this.particles.push(new Particle(Math.random() * this.$refs.canvas.width, Math.random() * this.$refs.canvas.height, false, this.$refs.canvas));
  }
  for (let i = 0; i < 200; i++) {
    this.dustParticles.push(new DustParticle(this.$refs.canvas)); // 传递 canvas 引用
  }
},adjustParticleCount() {
      const particleConfig = {
        heightConditions: [200, 300, 400, 500, 600],
        widthConditions: [450, 600, 900, 1200, 1600],
        particlesForHeight: [40, 60, 70, 90, 110],
        particlesForWidth: [40, 50, 70, 90, 110],
      };

      let numParticles = 130;

      for (let i = 0; i < particleConfig.heightConditions.length; i++) {
        if (this.$refs.canvas.height < particleConfig.heightConditions[i]) {
          numParticles = particleConfig.particlesForHeight[i];
          break;
        }
      }

      for (let i = 0; i < particleConfig.widthConditions.length; i++) {
        if (this.$refs.canvas.width < particleConfig.widthConditions[i]) {
          numParticles = Math.min(numParticles, particleConfig.particlesForWidth[i]);
          break;
        }
      }

      return numParticles;
    },
    drawBackground(ctx) {
      this.backgroundHue = (this.backgroundHue + 0.2) % 360;
      const gradient = ctx.createLinearGradient(0, 0, 0, this.$refs.canvas.height);
      gradient.addColorStop(0, `hsl(${this.backgroundHue}, 40%, 15%)`);
      gradient.addColorStop(1, `hsl(${(this.backgroundHue + 120) % 360}, 40%, 25%)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
    }, connectParticles(ctx) {
      const gridSize = 120;
      const grid = new Map();

      this.particles.forEach((p) => {
        const key = `${Math.floor(p.x / gridSize)},${Math.floor(p.y / gridSize)}`;
        if (!grid.has(key)) grid.set(key, []);
        grid.get(key).push(p);
      });

      ctx.lineWidth = 1.5;
      this.particles.forEach((p) => {
        const gridX = Math.floor(p.x / gridSize);
        const gridY = Math.floor(p.y / gridSize);

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const key = `${gridX + dx},${gridY + dy}`;
            if (grid.has(key)) {
              grid.get(key).forEach((neighbor) => {
                if (neighbor !== p) {
                  const diffX = neighbor.x - p.x;
                  const diffY = neighbor.y - p.y;
                  const dist = diffX * diffX + diffY * diffY;
                  if (dist < 10000) {
                    ctx.strokeStyle = `hsla(${(p.hue + neighbor.hue) / 2}, 80%, 60%, ${1 - Math.sqrt(dist) / 100})`;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(neighbor.x, neighbor.y);
                    ctx.stroke();
                  }
                }
              });
            }
          }
        }
      });
    },animate() {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext("2d");
      this.drawBackground(ctx);

      [this.dustParticles, this.particles, this.ripples, this.techRipples, this.fireworkParticles].forEach((arr) => {
        for (let i = arr.length - 1; i >= 0; i--) {
          const obj = arr[i];
          obj.update(this.mouse);
          obj.draw(ctx);
          if (obj.isDone?.() || obj.isDead?.()) arr.splice(i, 1);
        }
      });

      this.connectParticles(ctx);
      this.frameCount++;
      requestAnimationFrame(this.animate);
    },
    
  }
};
class Particle {
  constructor(x, y, isFirework = false, canvas) {
    this.canvas = canvas; // Store the canvas reference
    const baseSpeed = isFirework ? Math.random() * 2 + 1 : Math.random() * 0.5 + 0.3;

    Object.assign(this, {
      isFirework,
      x,
      y,
      vx: Math.cos(Math.random() * Math.PI * 2) * baseSpeed,
      vy: Math.sin(Math.random() * Math.PI * 2) * baseSpeed,
      size: isFirework ? Math.random() * 2 + 2 : Math.random() * 3 + 1,
      hue: Math.random() * 360,
      alpha: 1,
      sizeDirection: Math.random() < 0.5 ? -1 : 1,
      trail: []
    });
  }

  update(mouse) {
    const dist = mouse.x !== null ? (mouse.x - this.x) ** 2 + (mouse.y - this.y) ** 2 : 0;

    if (!this.isFirework) {
      const force = dist && dist < 22500 ? (22500 - dist) / 22500 : 0;

      if (mouse.x === null && this.autoDrift) {
        this.vx += (Math.random() - 0.5) * 0.03;
        this.vy += (Math.random() - 0.5) * 0.03;
      }

      if (dist) {
        const sqrtDist = Math.sqrt(dist);
        this.vx += ((mouse.x - this.x) / sqrtDist) * force * 0.1;
        this.vy += ((mouse.y - this.y) / sqrtDist) * force * 0.1;
      }

      this.vx *= mouse.x !== null ? 0.99 : 0.998;
      this.vy *= mouse.y !== null ? 0.99 : 0.998;
    } else {
      this.alpha -= 0.02;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x <= 0 || this.x >= this.canvas.width - 1) this.vx *= -0.9;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -0.9;

    this.size += this.sizeDirection * 0.1;
    if (this.size > 4 || this.size < 1) this.sizeDirection *= -1;

    this.hue = (this.hue + 0.3) % 360;

    if (this.frameCount % 2 === 0 && (Math.abs(this.vx) > 0.1 || Math.abs(this.vy) > 0.1)) {
      this.trail.push({
        x: this.x,
        y: this.y,
        hue: this.hue,
        alpha: this.alpha
      });
      if (this.trail.length > 15) this.trail.shift();
    }
  }


  draw(ctx) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, ${Math.max(this.alpha, 0)})`);
    gradient.addColorStop(1, `hsla(${this.hue + 30}, 80%, 30%, ${Math.max(this.alpha, 0)})`);

    ctx.fillStyle = gradient;
    ctx.shadowBlur = this.canvas.width > 900 ? 10 : 0;
    ctx.shadowColor = `hsl(${this.hue}, 80%, 60%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      for (let i = 0; i < this.trail.length - 1; i++) {
        const { x: x1, y: y1, hue: h1, alpha: a1 } = this.trail[i];
        const { x: x2, y: y2 } = this.trail[i + 1];
        ctx.strokeStyle = `hsla(${h1}, 80%, 60%, ${Math.max(a1, 0)})`;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    }
  }

  isDead() {
    return this.isFirework && this.alpha <= 0;
  }
}

class DustParticle {
  constructor(canvas) {
    this.canvas = canvas; // Store the canvas reference
    Object.assign(this, {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 1.5 + 0.5,
      hue: Math.random() * 360,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05
    });
  }

  update() {
    this.x = (this.x + this.vx + this.canvas.width) % this.canvas.width;
    this.y = (this.y + this.vy + this.canvas.height) % this.canvas.height;
    this.hue = (this.hue + 0.1) % 360;
  }

  draw(ctx) {
    ctx.fillStyle = `hsla(${this.hue}, 30%, 70%, 0.3)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Ripple {
  constructor(x, y, hue = 0, maxRadius = 30, canvas) {
    this.canvas = canvas; // Store the canvas reference
    Object.assign(this, { x, y, radius: 0, maxRadius, alpha: 0.5, hue });
  }

  update() {
    this.radius += 1.5;
    this.alpha -= 0.01;
    this.hue = (this.hue + 5) % 360;
  }

  draw(ctx) {
    ctx.strokeStyle = `hsla(${this.hue}, 80%, 60%, ${this.alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }

  isDone() {
    return this.alpha <= 0;
  }
}
</script>

<style>
canvas {
  display: white;
   
}
</style>