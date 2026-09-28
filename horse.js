const canvas = document.querySelector('#horse');
const ctx = canvas.getContext('2d');
const mask = document.createElement('canvas');
mask.width = 800; mask.height = 420;
const m = mask.getContext('2d', { willReadFrequently: true });
let time = 0, previous = 0, running = !matchMedia('(prefers-reduced-motion: reduce)').matches;
let speed = 1, alphabet = 'wildrunequus';
const TAU = Math.PI * 2;
function ellipse(x,y,rx,ry,angle=0){m.beginPath();m.ellipse(x,y,rx,ry,angle,0,TAU);m.fill();}
function limb(points,width){m.lineWidth=width;m.lineCap='round';m.lineJoin='round';m.beginPath();points.forEach(([x,y],i)=>i?m.lineTo(x,y):m.moveTo(x,y));m.stroke();}
function shape(t){
 m.clearRect(0,0,800,420);m.fillStyle=m.strokeStyle='#fff';
 const bob=Math.sin(t*2)*5; m.save();m.translate(0,bob);
 // Four independently phased articulated legs create the suspension and extension of a gallop.
 for(let side=0;side<2;side++){
  const p=t+side*.8;
  const hind=Math.sin(p), front=Math.sin(p+1.7);
  limb([[319,213],[310-hind*42,261],[340+hind*68,302-Math.max(0,-hind)*31],[352+hind*91,335-Math.max(0,-hind)*54]],side?13:10);
  ellipse(354+hind*91,337-Math.max(0,-hind)*54,12,6,-.2);
  limb([[477,206],[478+front*39,260],[477+front*74,291-Math.max(0,front)*28],[483+front*104,333-Math.max(0,front)*77]],side?12:9);
  ellipse(487+front*104,335-Math.max(0,front)*77,12,6,.2);
 }
 ellipse(391,195,109,48,-.06);ellipse(313,199,43,45,-.2);ellipse(473,187,42,57,.23);
 m.beginPath();m.moveTo(453,198);m.bezierCurveTo(479,162,491,110,524,86);m.bezierCurveTo(535,83,550,99,554,117);m.bezierCurveTo(529,144,532,179,492,216);m.closePath();m.fill();
 ellipse(549,108,34,20,.43);ellipse(574,121,29,14,.48);ellipse(591,130,13,12,.15);
 limb([[530,95],[530,70],[540,91]],7);limb([[544,94],[552,72],[554,99]],6);
 // The flowing mane and tail are also part of the glyph mask.
 for(let j=0;j<9;j++){let x=520-j*4,y=97+j*7;limb([[x,y],[x-22,y-8],[x-41-8*Math.sin(t+j*.4),y+6]],4);}
 for(let j=0;j<8;j++){m.lineWidth=5;m.beginPath();m.moveTo(286,180+j*2);m.bezierCurveTo(249,162+j*4,225,188+Math.sin(t+j*.3)*15,174-j*3,168+j*6+Math.sin(t+j*.25)*19);m.stroke();}
 m.globalCompositeOperation='destination-out';ellipse(563,105,3,3);m.globalCompositeOperation='source-over';m.restore();
}
function render(now){
 const delta=Math.min((now-previous)/1000,.05);previous=now;if(running)time+=delta*7*speed;
 const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,2);
 if(canvas.width!==Math.round(rect.width*dpr)||canvas.height!==Math.round(rect.height*dpr)){canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);}
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,rect.width,rect.height);shape(time);
 const pixels=m.getImageData(0,0,800,420).data;
 const scale=Math.min(rect.width/800,rect.height/420)*1.13;
 const ox=(rect.width-800*scale)/2,oy=(rect.height-420*scale)/2-5;
 const colors=getComputedStyle(document.body);ctx.fillStyle=colors.getPropertyValue('--ink');ctx.font=`${9*scale}px 'Space Mono',monospace`;ctx.textAlign='center';
 for(let y=60;y<354;y+=9){for(let x=125;x<615;x+=7){if(pixels[(y*800+x)*4+3]>100){const hash=(x*13+y*7)%alphabet.length;ctx.globalAlpha=.55+((x*3+y*11)%10)/23;ctx.fillText(alphabet[hash],ox+x*scale,oy+y*scale);}}}
 // A sparse field of passing typographic dust gives the fixed figure forward momentum.
 ctx.fillStyle=colors.getPropertyValue('--muted');ctx.font=`${9*scale}px monospace`;
 for(let i=0;i<30;i++){const x=((i*137-time*39)%720+720)%720;const y=356+(i%4)*7;ctx.globalAlpha=.12+(i%3)*.06;ctx.fillText(i%3===0?'—':'.',ox+x*scale,oy+y*scale);}
 ctx.globalAlpha=1;requestAnimationFrame(render);
}
function updatePlay(){document.querySelector('#play-icon').textContent=running?'Ⅱ':'▷';document.querySelector('#play-text').textContent=running?'Pause':'Play';document.querySelector('#play').setAttribute('aria-label',running?'Pause animation':'Play animation');}
document.querySelector('#play').onclick=()=>{running=!running;updatePlay();};
document.querySelector('#speed').oninput=e=>{speed=Number(e.target.value);document.querySelector('#pace').textContent=speed.toFixed(1)+'×';};
document.querySelector('#alphabet').onchange=e=>{alphabet={type:'wildrunequus',symbols:'@#%&*+=:;',binary:'01001101'}[e.target.value];};
document.querySelector('#theme').onclick=()=>document.body.classList.toggle('light');
updatePlay();requestAnimationFrame(render);
