(()=>{
 const rotor=document.querySelector('#wheel-rotor');
 const spin=document.querySelector('#spin-button');
 const status=document.querySelector('#spin-status');
 const dialog=document.querySelector('#winner-dialog');
 const sound=document.querySelector('#wheel-sound');
 const colors=['#43a7e0','#a46bd0','#f6d867','#70c99f'];
 const ns='http://www.w3.org/2000/svg';
 const point=a=>[300+287*Math.cos(a*Math.PI/180),300+287*Math.sin(a*Math.PI/180)];
 function node(tag,attrs,parent){const el=document.createElementNS(ns,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);parent.append(el);return el;}
 for(let i=0;i<8;i++){
  const a=i*45,b=a+45,[x,y]=point(a),[u,v]=point(b);
  node('path',{d:`M300 300 L${x} ${y} A287 287 0 0 1 ${u} ${v} Z`,fill:colors[i%4],stroke:'#ffffff25','stroke-width':2},rotor);
  const angle=(a+22.5)*Math.PI/180;
  const face=node('g',{transform:`translate(${300+193*Math.cos(angle)} ${300+193*Math.sin(angle)}) rotate(${a+22.5+90})`},rotor);
  node('circle',{r:51,fill:'#fff7df'},face);
  // Crop the source portrait without stretching it. Same source in every segment.
  const crop=node('svg',{x:-48,y:-48,width:96,height:96,viewBox:'450 55 340 380',preserveAspectRatio:'xMidYMid slice','clip-path':'url(#wheel-face-clip)'},face);
  // The outer group clip uses wheel-local coordinates, keeping the face circular.
  crop.removeAttribute('clip-path');face.setAttribute('clip-path','url(#wheel-face-clip)');
  node('image',{href:'assets/souvenir-cafe-cadre.png',width:1158,height:1359},crop);
 }
 let rotation=0,busy=false,enabled=true,ctx,frame=0;
 function tone(freq=900,duration=.035,volume=.06){
  if(!enabled||!ctx||ctx.state!=='running')return;
  const oscillator=ctx.createOscillator(),gain=ctx.createGain();
  oscillator.type='triangle';oscillator.frequency.setValueAtTime(freq,ctx.currentTime);
  gain.gain.setValueAtTime(volume,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);
  oscillator.connect(gain);gain.connect(ctx.destination);oscillator.start();oscillator.stop(ctx.currentTime+duration);
 }
 function finish(target){
  rotation=target;rotor.setAttribute('transform',`rotate(${rotation} 300 300)`);
  busy=false;spin.disabled=false;status.textContent='Winner: kharmouuuuuuch! 🏆';
  dialog.showModal();celebrate();
  [523,659,784].forEach((f,i)=>setTimeout(()=>tone(f,.18,.07),i*120));
 }
 function start(){
  if(busy)return;
  if(dialog.open)dialog.close();
  busy=true;spin.disabled=true;status.textContent='Spinning… ✦';
  if(enabled){try{ctx??=new(window.AudioContext||window.webkitAudioContext)();ctx.resume().catch(()=>{});}catch{}}
  // Pointer is at 0 degrees. Each segment centre is i*45 + 22.5.
  const section=Math.floor(Math.random()*8),turns=5+Math.floor(Math.random()*3);
  const landing=(360-(section*45+22.5))%360;
  const delta=(landing-(rotation%360)+360)%360;
  const target=rotation+turns*360+delta;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){finish(target);return;}
  const initial=rotation,distance=target-initial,duration=5500+Math.random()*1000;
  let startTime,lastTick=Math.floor((initial+22.5)/45);
  function animate(now){
   startTime??=now;
   const t=Math.min(1,(now-startTime)/duration),eased=1-Math.pow(1-t,4);
   rotation=initial+distance*eased;rotor.setAttribute('transform',`rotate(${rotation} 300 300)`);
   const tick=Math.floor((rotation+22.5)/45);
   if(tick!==lastTick){tone(650+Math.random()*350);lastTick=tick;}
   if(t<1)frame=requestAnimationFrame(animate);else finish(target);
  }
  frame=requestAnimationFrame(animate);
 }
 spin.addEventListener('click',start);
 document.querySelector('#spin-again').addEventListener('click',start);
 document.querySelector('#winner-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>spin.focus());
 sound.addEventListener('click',()=>{enabled=!enabled;sound.setAttribute('aria-pressed',String(enabled));sound.textContent=enabled?'Sound: ON ♫':'Sound: OFF';});
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);if(busy){busy=false;spin.disabled=false;status.textContent='Ready for a little magic?';}ctx?.suspend().catch(()=>{});});
})();
