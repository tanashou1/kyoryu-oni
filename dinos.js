/* Original vector wildlife illustrations. No external assets or network requests. */
'use strict';
window.Dinos=(()=>{
 const species=[
  {id:'tyranno',name:'ティラノサウルス',color:'#88754d',dark:'#514b33',type:'theropod',diet:'meat'},
  {id:'allo',name:'アロサウルス',color:'#819472',dark:'#435d49',type:'theropod',diet:'meat'},
  {id:'carno',name:'カルノタウルス',color:'#ae7559',dark:'#724735',type:'theropod',diet:'meat'},
  {id:'spino',name:'スピノサウルス',color:'#789b91',dark:'#3e655e',type:'theropod',diet:'fish'},
  {id:'stego',name:'ステゴサウルス',color:'#8b9570',dark:'#596140',type:'quadruped',diet:'leaves'},
  {id:'mosa',name:'モササウルス',color:'#648d9b',dark:'#365d70',type:'marine',diet:'fish'},
  {id:'giga',name:'ギガントサウルス',color:'#8a8c84',dark:'#4d574d',type:'theropod',diet:'meat'},
  {id:'purus',name:'プルスサウルス',color:'#7f8858',dark:'#485234',type:'croc',diet:'fish'},
  {id:'trike',name:'トリケラトプス',color:'#a68b65',dark:'#6b583f',type:'quadruped',diet:'leaves'},
  {id:'ptera',name:'プテラノドン',color:'#b18c64',dark:'#775b42',type:'flying',diet:'fish'},
  {id:'argentine',name:'アルゼンチノサウルス',color:'#82938a',dark:'#4d655e',type:'sauropod',diet:'leaves'}
 ];
 function pick(previous){const pool=species.filter(s=>s.id!==previous?.id);return pool[Math.floor(Math.random()*pool.length)]}
 function draw(ctx,x,y,size,s,move=0){
  const matrix=ctx.getTransform();ctx.save();ctx.translate(x,y-move);ctx.scale(size,size*matrix.a/matrix.d);
  const fill=(d,color)=>{ctx.fillStyle=color;ctx.fill(new Path2D(d))};
  const line=(d,color,width=1)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineJoin='round';ctx.lineCap='round';ctx.stroke(new Path2D(d))};
  const oval=(x,y,rx,ry,c)=>{ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill()};
  const grad=ctx.createLinearGradient(0,-125,15,10);grad.addColorStop(0,s.color);grad.addColorStop(.55,s.color);grad.addColorStop(1,s.dark);
  const skin=d=>{fill(d,grad);line(d,s.dark,1.1)};
  const claws=(x,y)=>{for(let i=0;i<3;i++)fill(`M${x+i*4} ${y}l7 3-7 1Z`,'#dfd4b7')};
  oval(-2,9,83,8,'#334c3820');
  if(s.type==='theropod'){
   skin('M-31-57Q-71-61-119-43Q-83-65-57-79Q-28-97 5-76L23-97 43-96 37-62Q12-37-24-46Z');
   if(s.id==='spino'){skin('M-54-77Q-47-134-35-121L-23-130-10-124 2-98 12-78Z');for(let i=0;i<5;i++)line(`M${-47+i*12} -80l${-1+i} ${-21-(i<3?i*5:0)}`,s.dark,1.4)}
   skin('M-4-55Q20-56 15-29L4-12 17-4 34-2 32 4 3 4-12-11-7-31Z');
   skin('M-30-54Q-3-56-10-31L-23-12-14-3 7-2 5 5-22 5-37-11-29-32Z');claws(-10,1);claws(20,0);
   const long=s.id==='spino';
   skin(long?'M18-92Q29-111 48-107L91-96Q102-89 91-83L56-82 34-63 19-63Z':'M16-94Q21-118 48-117L70-111 78-97 74-86 45-85 29-65 15-69Z');
   line(long?'M55-91 94-89':'M47-97 75-96',s.dark,2);
   for(let i=0;i<5;i++)fill(`M${(long?60:49)+i*5} -94l2 4 2-4Z`,'#eee5d1');
   oval(long?44:44,long?-102:-109,3.5,2.6,'#dbbc67');oval(45,long?-102:-109,1.5,2.4,'#253c31');
   oval(long?87:68,long?-96:-106,1.6,1.2,s.dark);
   if(s.id==='carno'){fill('M32-113 28-129 42-116 52-117 60-129 59-113Z','#d8cbb0')}
   if(s.id==='allo'){fill('M35-115 39-123 49-117Z','#ae8060');fill('M49-115 55-121 59-113Z','#ae8060')}
   if(s.id==='giga')fill('M25-114 32-120 36-116 45-121 49-117 58-119 66-111Z',s.dark);
   skin(s.id==='carno'?'M20-68 30-59 26-54 23-63Z':'M17-70 34-59 29-51 24-53 27-59 13-61Z');
   for(let i=0;i<7;i++)line(`M${-64+i*12} ${-72+(i<3?i*0:-i)}l-4 13`,s.dark,3);
  }else if(s.type==='quadruped'){
   skin('M-40-44Q-87-32-118-51Q-84-47-55-66Q-19-98 27-75L50-50 28-30-35-28Z');
   skin('M-34-42-30-5-16-2-16 5-43 5-48-41Z');skin('M13-44 18-5 32-2 32 5 6 5 0-37Z');
   skin('M-18-40-14-6 0-2 0 5-25 5-32-37Z');skin('M34-46 36-8 50-2 48 5 24 5 20-37Z');
   if(s.id==='stego'){
    for(let i=0;i<7;i++){const x=-65+i*16,top=-75-Math.sin(i/6*Math.PI)*35;skin(`M${x} -65l-10 ${top+65} 13-15 14 17-8 ${-top-64}Z`)}
    skin('M28-61Q43-50 61-49L72-38 65-30 40-35 24-42Z');oval(59,-43,2,2,'#263d31');line('M61-34 70-35',s.dark,1.5);
    fill('M-93-46-105-67-99-46-117-58-109-42Z','#ded1ad');
   }else{
    skin('M32-70Q25-113 46-111Q69-110 68-73L88-57 85-43 65-38 42-49Z');
    line('M40-94 53-67 61-92',s.dark,2);fill('M54-75 74-115 67-69Z','#e4d8ba');fill('M64-69 88-103 77-60Z','#f2e6cd');fill('M82-58 95-75 89-49Z','#e8ddc3');oval(70,-59,2.6,2.1,'#24392c');line('M75-43 85-44',s.dark,1.6);
   }
   claws(-27,2);claws(34,2);
  }else if(s.type==='sauropod'){
   skin('M-38-57Q-87-56-122-21Q-83-73-49-79Q-8-103 30-70Q50-80 49-131L43-153Q43-164 59-165L77-159 78-148 64-144Q75-80 48-52L29-32-33-32Z');
   for(const [a,b] of [[-34,-24],[18,28],[-14,-4],[36,44]])skin(`M${a}-48 ${b}-5 ${b+11} 0 ${b+9} 6 ${b-10} 6 ${a-10}-42Z`);
   oval(66,-156,2.2,2,'#273e34');line('M67-148 77-149',s.dark,1.4);
   for(let i=0;i<7;i++)line(`M${-43+i*12} -67l-1 20`,s.dark,2);
  }else if(s.type==='marine'){
   skin('M-42-64Q-77-62-111-91L-99-58-119-34Q-79-40-48-38Q-8-17 34-41L70-50 93-63 87-76 43-77Q4-93-42-64Z');
   skin('M-19-43Q-45-16-27 1L4-38Z');skin('M30-54Q31-16 54-8L47-56Z');
   line('M56-63 90-65',s.dark,2);oval(58,-72,2.7,2.3,'#e0c874');oval(59,-72,1.4,2,'#243c37');
   for(let i=0;i<6;i++)fill(`M${61+i*4}-64l2 4 1-4Z`,'#eae1cd');
   line('M-73-54Q-10-72 36-57','#b5c7b8',2);
  }else if(s.type==='croc'){
   skin('M-47-43Q-90-36-126-52Q-88-60-53-64Q-10-81 34-60L69-59 93-50 94-39 37-36Q-6-24-47-43Z');
   for(const [x,y] of [[-35,-46],[13,-42]]){skin(`M${x} ${y}l-15 17 6 19 14-3-6-14 13-9Z`);skin(`M${x+25} ${y}l21 14-8 17-13-1 8-12-19-5Z`)}
   for(let i=0;i<11;i++)fill(`M${-78+i*12}-54l4-12 6 12Z`,s.dark);
   oval(48,-58,4,3,'#d8ba6b');oval(49,-58,1.4,2.6,'#26372b');line('M40-43 92-44',s.dark,2);
   for(let i=0;i<9;i++)fill(`M${50+i*4}-44l2 3 1-3Z`,'#ddd2ae');
  }else{
   skin('M-7-69-48-116-116-86-58-79-47-27-16-52 7-37 32-16 37-63 84-91 25-93 6-75Z');
   fill('M-10-65-48-110-104-87-54-81-45-35Z','#c8ab88');fill('M8-65 27-89 73-90 33-65 30-27Z','#c8ab88');
   for(const d of ['M-9-65-48-110-54-81-45-35','M10-65 27-89 33-65 30-27'])line(d,s.dark,1.5);
   skin('M-9-76Q-7-106 13-112L24-105 72-97 24-89 11-62-2-49-15-57Z');fill('M-1-104-29-134 14-111Z',s.dark);oval(15,-103,2.6,2.4,'#273b32');line('M25-98 66-97',s.dark,1.2);
   skin('M-6-52-14-26-7-22 0-46 8-26 16-24 11-53Z');
  }
  // Small scales and reflected light give every animal texture and volume.
  for(let i=0;i<30;i++){const px=-43+(i%10)*7,py=-59+Math.floor(i/10)*7;oval(px,py,1.1,.8,i%3?'#f4e6c622':s.dark+'66')}
  ctx.restore();
 }
 return {species,pick,draw};
})();
