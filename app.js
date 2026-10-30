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
document.querySelector('#wish').addEventListener('click',e=>{celebrate();document.querySelector('#wish-message').textContent='Tfat chem3a… w b9at l’oumnia. Kantmenna lik ga3 lfer7a li f denya, Hanae. 3id milad sa3id! ♡ — Amine';e.currentTarget.textContent='L’oumnia f l9elb ♡';e.currentTarget.disabled=true});render();
