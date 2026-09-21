let Q=0,dep=0;
const SW=[0,0,0,0],BV=[0,0,0,1];
const w=()=>SW[0]+SW[1]*2+SW[2]*4+SW[3]*8;
const bv=()=>BV[0]+BV[1]*2+BV[2]*4+BV[3]*8;
const $=id=>document.getElementById(id);
function render(msg){
  const B=bv(),cargo=w(),tens=Q>=10?1:0,units=Q>=10?Q-10:Q;
  const cmp=Q<B?'A<B':Q>B?'A>B':'A=B';
  $('t').textContent=tens;$('u').textContent=units;$('c').textContent=dep;
  $('ly').className='dot'+(cmp==='A<B'?' on-y':'');
  $('lr').className='dot'+(cmp==='A>B'?' on-r':'');
  $('lg').className='dot'+(cmp==='A=B'?' on-g':'');
  $('trace').textContent=`SW ${[...SW].reverse().join('')}=${cargo}  B ${[...BV].reverse().join('')}=${B}\nQ=${Q}  BCD ${tens}${units}  ${cmp}  dep=${dep}`+(msg?`\n${msg}`:'');
}
function pulse(){
  const cargo=w();
  if(!cargo){render('Empty ship rejected.');return;}
  Q=(Q+cargo)%16;const B=bv();
  if(Q===B){dep=(dep+1)%10;const q=Q;Q=0;render(`Full ship: count ${dep}, dock ${q}->00.`);}
  else render(`Loaded ${cargo} -> Q=${Q}.`);
}
window.addEventListener('DOMContentLoaded',()=>{
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.2});
  document.querySelectorAll('.reveal,.stage').forEach(el=>io.observe(el));
  const bar=document.getElementById('bar');
  addEventListener('scroll',()=>{
    const h=document.documentElement,p=h.scrollTop/(h.scrollHeight-h.clientHeight||1);
    bar.style.width=(p*100)+'%';
  },{passive:true});
  for(let i=0;i<4;i++){
    $('s'+i).onclick=()=>{SW[i]^=1;$('s'+i).setAttribute('aria-pressed',SW[i]?'true':'false');render();};
    $('b'+i).onclick=()=>{BV[i]^=1;$('b'+i).setAttribute('aria-pressed',BV[i]?'true':'false');render();};
  }
  $('b3').setAttribute('aria-pressed','true');
  $('go').onclick=pulse;
  $('rs').onclick=()=>{Q=0;dep=0;render('Reset.');};
  render('Scroll up for the story. Pulse below to play.');
});
