const questions=[{q:'Chkoun li dima 3endo l7e9? 🤔',a:['Hanae','Hanae, évidemment','Nswlo Amine… ah ta howa gal Hanae'],f:'Bravo! Ga3 l’ajwiba s7a7. Amine fahm l9a3ida 😂'},{q:'Chno khas Amine yjib m3ah ila bgha ydir surprise?',a:['L7elwa 🍰','Lward 🌷','Rasso… w ma yنساش l7elwa 😂'],f:'L7elwa zwina, lward zwin… walakin l’effort men l9elb howa li kay7seb ♡'},{q:'Ila kan de7kek chi 7aja, chno ghadi ykoun?',a:['Dwa d nhar ☀️','A7la notification 💌','Ga3 hadchi, w kter ✨'],f:'Had sou2al ma fihch ghalat. De7ktek hiya l’cadeau l7a9i9i ♡'},{q:'Chkoun hiya star dyal 31 octobre? 🎂',a:['Hanae 👑','Ta hiya Hanae 💖','Mazal katsewel? Hanae! 😂'],f:'Officiellement: Hanae rb7at l’quiz! L’prix? Wa7d message men l9elb, lte7t 💌'}];
questions.push({q:'Wach ba9a katbghini? 🥺',a:['Ah ❤️','La 🙈'],love:true,f:'Ah? Farre7ti 9elbi, Hanae! ❤️ — Amine'});
let current=0;const question=document.querySelector('#question'),answers=document.querySelector('#answers'),feedback=document.querySelector('#feedback'),next=document.querySelector('#next'),restart=document.querySelector('#restart');
function render(){
 const item=questions[current], total=questions.length;
 document.querySelector('#counter').textContent=`QUESTION ${String(current+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
 document.querySelector('#progress').style.width=`${current/total*100}%`;
 question.textContent=item.q;answers.replaceChildren();answers.classList.toggle('love-answers',!!item.love);
 feedback.textContent='';next.hidden=true;restart.hidden=true;
 item.a.forEach((label,index)=>{
  const button=document.createElement('button');button.className='answer';button.textContent=item.love?label:`${String.fromCharCode(65+index)}.  ${label}`;
  if(item.love && index===1){
   button.classList.add('runaway');
   function dodge(event){
    if(button.disabled)return;
    if(event.cancelable)event.preventDefault();
    const maxX=Math.max(0,answers.clientWidth-button.offsetWidth-8);
    const maxY=Math.max(0,answers.clientHeight-button.offsetHeight-8);
    // Keep the playful button below Ah and inside the quiz, even on mobile.
    const minY=Math.min(maxY,60);
    const x=button.offsetLeft < maxX/2 ? maxX : 0;
    const y=button.offsetTop < (minY+maxY)/2 ? maxY : minY;
    button.style.left=`${x}px`;button.style.top=`${y}px`;
   }
   button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')dodge(event)});
   button.addEventListener('pointerdown',dodge);
   // Also swallow the synthetic click sent after a tap, or a keyboard click.
   button.addEventListener('click',dodge);
   answers.append(button);
   return;
  }
  button.addEventListener('click',()=>{
   answers.querySelectorAll('button').forEach(b=>b.disabled=true);button.classList.add('selected');
   feedback.textContent=item.love&&index===1?'Kan7tarem jawabek, Hanae. Khodi wa9tek, w 3id milad sa3id ♡':item.f;
   document.querySelector('#progress').style.width=`${(current+1)/total*100}%`;
   if(current<total-1){next.hidden=false}else{restart.hidden=false;if(!item.love||index===0)celebrate()}
  });answers.append(button);
 });
}
next.addEventListener('click',()=>{current++;render();question.setAttribute('tabindex','-1');question.focus()});restart.addEventListener('click',()=>{current=0;render()});
function celebrate(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const box=document.querySelector('#confetti');for(let i=0;i<45;i++){const heart=document.createElement('span');heart.className='confetto';heart.textContent=['♡','✧','♥'][i%3];heart.style.left=`${Math.random()*100}%`;heart.style.color=['#a94e61','#c99656','#d6a7ad'][i%3];heart.style.animationDelay=`${Math.random()*.6}s`;box.append(heart);setTimeout(()=>heart.remove(),4000)}}
document.querySelector('#wish').addEventListener('click',e=>{const cake=document.querySelector('#birthday-cake');cake.classList.add('blown-out');cake.setAttribute('aria-label','Gateau dyal 22 3am, chmi3at tfaw');celebrate();document.querySelector('#wish-message').textContent='Tfaw chmi3at dyal 22… w b9at l’oumnia. Kantmenna lik ga3 lfer7a li f denya, Hanae. 3id milad sa3id! ♡ — Amine';e.currentTarget.textContent='L’oumnia f l9elb ♡';e.currentTarget.disabled=true});render();

const music=document.querySelector('#birthday-music');
const musicToggle=document.querySelector('#music-toggle');
const musicStatus=document.querySelector('#music-status');
music.volume=0.35;
function syncMusic(){
 musicToggle.textContent=music.paused?'Ch3li l’ambiance ♫':'We9fi l’musique Ⅱ';
 musicToggle.setAttribute('aria-pressed',String(!music.paused));
}
musicToggle.addEventListener('click',async()=>{
 if(!music.paused){music.pause();return;}
 musicToggle.disabled=true;musicStatus.textContent='';
 try{await music.play();}catch{musicStatus.textContent='Ma khdematch l’musique. Jerrbi merra khra ♡';}
 finally{musicToggle.disabled=false;syncMusic();}
});
music.addEventListener('play',syncMusic);
music.addEventListener('pause',syncMusic);
music.addEventListener('error',()=>{
 musicStatus.textContent='Ma khdematch l’musique. Jerrbi merra khra ♡';syncMusic();
});

const souvenirVideos=document.querySelectorAll('.memory-video video');
souvenirVideos.forEach(video=>{
 video.addEventListener('play',()=>{
  music.pause();
  souvenirVideos.forEach(other=>{if(other!==video)other.pause();});
 });
});
music.addEventListener('play',()=>{
 souvenirVideos.forEach(video=>video.pause());
});

// Try on arrival; if blocked, retry inside the first user gesture.
let awaitingMusicStart=true;
function stopAutomaticMusic(){
 awaitingMusicStart=false;
 document.removeEventListener('click',startMusicOnGesture);
 document.removeEventListener('keydown',startMusicOnGesture);
}
function startMusicOnGesture(event){
 if(!awaitingMusicStart||event.target.closest('#music-toggle, video'))return;
 if(event.type==='keydown'&&(event.repeat||!['Enter',' '].includes(event.key)))return;
 music.play().catch(()=>{});
}
music.addEventListener('play',()=>{
 stopAutomaticMusic();musicStatus.textContent='';
});
musicToggle.addEventListener('click',stopAutomaticMusic);
souvenirVideos.forEach(video=>video.addEventListener('play',stopAutomaticMusic));
document.addEventListener('click',startMusicOnGesture);
document.addEventListener('keydown',startMusicOnGesture);
music.play().catch(error=>{
 if(!awaitingMusicStart)return;
 if(error.name==='NotAllowedError'){
  musicStatus.textContent='Dghti f la page bach tebda l’musique ♫';
 }
});
