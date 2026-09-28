// Every accessory is rasterized into the same mask and rendered as orange glyphs.
const pick = list => list[Math.floor(Math.random() * list.length)];
let outfit = { shoes: 'bare', hat: 'none', prop: 'none', back: 'none', glasses: false, size: 1 };
function newOutfit() {
  outfit = {
    shoes: pick(['heels', 'heels', 'boots', 'skates', 'sneakers']),
    hat: pick(['crown', 'cowboy', 'party', 'top hat', 'antennae', 'halo', 'none']),
    prop: pick(['phone', 'phone', 'coffee', 'pizza', 'balloon', 'umbrella', 'dumbbell']),
    back: pick(['wings', 'cape', 'rocket', 'tutu', 'none']),
    glasses: Math.random() > 0.45,
    size: 0.85 + Math.random() * 0.3,
  };
}
function line(points, width = 5) {
  m.lineWidth = width; m.lineCap = 'round'; m.lineJoin = 'round';
  m.beginPath(); points.forEach(([x,y],i) => i ? m.lineTo(x,y) : m.moveTo(x,y)); m.stroke();
}
function shoe() {
  m.fillStyle = m.strokeStyle = '#fff';
  if (outfit.shoes === 'heels') {
    path('M -12 -14 L -2 -13 L 8 1 L 28 8 Q 34 13 23 16 L 1 12 L -7 0 L -8 27 L -14 27 Z');
  } else if (outfit.shoes === 'boots') {
    path('M -13 -30 L 9 -30 L 9 2 Q 35 1 32 16 L -15 16 Z');
  } else if (outfit.shoes === 'skates') {
    path('M -12 -17 L 7 -17 L 10 0 L 28 6 L 28 13 L -14 13 Z');
    oval(-5, 22, 7, 7); oval(21, 22, 7, 7);
  } else if (outfit.shoes === 'sneakers') {
    path('M -13 -12 L 8 -12 L 15 0 L 32 5 L 33 16 L -15 16 Z');
    m.fillStyle = '#666'; m.fillRect(-7, 3, 29, 4);
  }
}
function backAccessory(t) {
  m.fillStyle = m.strokeStyle = '#eee';
  if (outfit.back === 'wings') {
    m.save(); m.translate(504, 258); m.rotate(Math.sin(t) * 0.18);
    path('M 0 0 Q -55 -110 -145 -167 Q -145 -119 -116 -89 L -148 -113 Q -136 -64 -99 -43 L -130 -55 Q -94 -1 0 0 Z');
    m.strokeStyle = '#777';
    for (let i=0;i<5;i++) line([[-8,-5],[-115+i*14,-123+i*17]],3);
    m.restore();
  } else if (outfit.back === 'cape') {
    m.beginPath();m.moveTo(589,233);m.bezierCurveTo(482,197,348,191+Math.sin(t)*20,231,231);m.lineTo(248,320+Math.sin(t)*15);m.bezierCurveTo(345,276,461,316,589,249);m.fill();
  } else if (outfit.back === 'rocket') {
    m.save();m.translate(459,213);m.rotate(-0.2);
    path('M -62 -20 L 54 -20 L 89 0 L 54 20 L -62 20 Z');
    m.fillStyle='#999';oval(48,0,12,12);
    m.fillStyle='#fff';path(`M -65 -14 L ${-105-Math.sin(t*3)*15} 0 L -65 14 Z`);m.restore();
  } else if (outfit.back === 'tutu') {
    for(let i=0;i<12;i++){m.fillStyle=i%2?'#aaa':'#fff';path(`M ${355+i*8} 278 L ${320+i*14} ${365+Math.sin(t+i)*9} L ${342+i*14} 365 Z`);}
  }
}
function accessories(t) {
  m.save();m.translate(0,Math.sin(t*2)*9);
  backAccessory(t);
  m.fillStyle=m.strokeStyle='#fff';
  m.save();m.translate(692,159);m.scale(outfit.size,outfit.size);
  if(outfit.hat==='crown') path('M -25 0 L -32 -40 L -13 -23 L 0 -49 L 13 -23 L 32 -40 L 25 0 Z');
  if(outfit.hat==='cowboy'){oval(0,-4,53,10,-.08);path('M -27 -7 Q -32 -55 -12 -48 Q 0 -38 15 -50 Q 32 -49 26 -7 Z');}
  if(outfit.hat==='party'){path('M -29 0 L 0 -72 L 29 0 Z');oval(0,-74,8,8);m.fillStyle='#777';oval(-4,-34,6,6);oval(11,-14,6,6);}
  if(outfit.hat==='top hat'){m.fillRect(-28,-61,56,55);m.fillRect(-44,-9,88,12);m.fillStyle='#888';m.fillRect(-28,-23,56,8);}
  if(outfit.hat==='antennae'){line([[-15,0],[-26,-40]],5);line([[15,0],[29,-44]],5);oval(-26,-43,11,11);oval(29,-47,11,11);}
  if(outfit.hat==='halo'){m.lineWidth=5;m.beginPath();m.ellipse(0,-42,39,9,0,0,Math.PI*2);m.stroke();}
  m.restore();m.fillStyle=m.strokeStyle='#fff';
  if(outfit.glasses){m.save();m.translate(718,187);m.rotate(.23);m.fillRect(-22,-10,22,18);m.fillRect(7,-10,22,18);line([[-34,-9],[29,-9]],4);m.restore();}
  // An extra cartoon arm holds a prop while all four legs keep galloping.
  if(outfit.prop!=='none'){
    const py=285+Math.sin(t)*6;
    line([[611,293],[684,318],[781,py]],10);oval(781,py,10,9);
    m.save();m.translate(789,py);m.rotate(Math.sin(t)*.04);
    if(outfit.prop==='phone'){
      m.fillRect(-13,-62,39,68);m.fillStyle='#555';m.fillRect(-7,-54,27,44);m.fillStyle='#fff';oval(6,-1,3,3);
      m.fillRect(-2,-47,17,4);m.fillRect(-2,-37,12,4);
    }
    if(outfit.prop==='coffee'){path('M -13 -42 L 24 -42 L 18 5 L -8 5 Z');m.fillRect(-18,-48,48,7);line([[30,-43],[36,-54],[29,-66]],3);}
    if(outfit.prop==='pizza'){path('M -23 -53 L 37 -35 L 0 5 Z');m.fillStyle='#777';oval(-2,-35,6,6);oval(16,-31,5,5);oval(1,-15,5,5);}
    if(outfit.prop==='balloon'){line([[0,0],[28,-76],[18,-116]],3);oval(18,-153,29,38);}
    if(outfit.prop==='umbrella'){line([[0,0],[0,-111]],5);path('M -69 -107 Q 0 -193 69 -107 Q 35 -120 0 -108 Q -34 -121 -69 -107 Z');}
    if(outfit.prop==='dumbbell'){line([[-35,-17],[35,-17]],8);m.fillRect(-43,-45,16,55);m.fillRect(27,-45,16,55);}
    m.restore();
  }
  m.restore();
}
