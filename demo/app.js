let Q = 0, dep = 0, B = 8, SW = [0,0,0,0], BV = [0,0,0,0];
const w = () => SW[0]*1 + SW[1]*2 + SW[2]*4 + SW[3]*8;
const bv = () => BV[0]*1 + BV[1]*2 + BV[2]*4 + BV[3]*8;
const $ = (id) => document.getElementById(id);

function render(msg){
  B = bv();
  const cargo = w();
  const orOut = cargo !== 0 ? 1 : 0;
  const bcdFlag = Q >= 10 ? 1 : 0;
  const tens = bcdFlag ? 1 : 0, units = bcdFlag ? Q - 10 : Q;
  let cmp = Q < B ? 'A<B' : Q > B ? 'A>B' : 'A=B';
  $('d-tens').textContent = tens;
  $('d-units').textContent = units;
  $('d-dep').textContent = dep;
  $('led-y').className = 'dot' + (cmp==='A<B' ? ' on-yellow' : '');
  $('led-r').className = 'dot' + (cmp==='A>B' ? ' on-red' : '');
  $('led-g').className = 'dot' + (cmp==='A=B' ? ' on-green' : '');
  $('trace').innerHTML =
    `SW <b>${SW.slice().reverse().join('')}=${cargo}</b>  OR=${orOut}  B <b>${BV.slice().reverse().join('')}=${B}</b>\n` +
    `U6 Q=<b>${Q}</b> (${Q.toString(2).padStart(4,'0')})  BCD flag=${bcdFlag}  Tens=${tens} Units=${units}\n` +
    `U9: Q ${cmp} B  QA<B=${cmp==='A<B'?1:0} QA>B=${cmp==='A>B'?1:0} QA=B=${cmp==='A=B'?1:0}  U10 dep=${dep}` +
    (msg ? `\n— ${msg}` : '');
}

function pulse(){
  const cargo = w();
  if(cargo === 0){ render('Empty ship rejected: OR-tree LOW, no PL.'); return; }
  const next = (Q + cargo) % 16;
  const wrapped = Q + cargo >= 16;
  Q = next;
  B = bv();
  if(Q === B){
    dep = (dep + 1) % 10;
    const d = dep, q = Q;
    Q = 0;
    render(`QA=B: count->${d}, MR cleared dock ${q}->00.`);
  } else {
    render(wrapped ? `Loaded ${cargo}, 4-bit wrap to ${Q}.` : `Loaded ${cargo} -> Q=${Q}.`);
  }
}

function bindToggle(prefix, arr){
  for(let i=0;i<4;i++){
    const el = $(`${prefix}${i}`);
    el.addEventListener('click', () => {
      arr[i] = arr[i] ? 0 : 1;
      el.setAttribute('aria-pressed', arr[i] ? 'true' : 'false');
      render();
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  bindToggle('sw', SW);
  bindToggle('bv', BV);
  // default B=8 -> BV bit3
  BV[3]=1; $('bv3').setAttribute('aria-pressed','true');
  $('pulse').addEventListener('click', pulse);
  $('reset').addEventListener('click', () => { Q=0; dep=0; render('Reset: Q=00 dep=0.'); });
  document.querySelectorAll('[data-demo]').forEach(b => b.addEventListener('click', () => {
    const s = b.getAttribute('data-demo');
    if(s==='s1'){ SW=[1,1,0,0]; syncToggles(); pulse(); }
    if(s==='s2'){ SW=[1,0,1,0]; syncToggles(); pulse(); }
    if(s==='s3'){ SW=[1,0,1,0]; syncToggles(); pulse(); SW=[1,0,1,0]; syncToggles(); pulse(); }
    if(s==='clear'){ Q=0; dep=0; render('Cleared.'); }
  }));
  function syncToggles(){
    for(let i=0;i<4;i++) $('sw'+i).setAttribute('aria-pressed', SW[i]?'true':'false');
  }
  render('Ready. Set SW, set B, press Pulse Arrival.');
});
