const $=id=>document.getElementById(id);
const PAGES=[["index.html","Bait picker"],["stats.html","Luck, scale, prospect"],["baitchance.html","Bait chance"],["petluck.html","Pet luck"]];
(function(){const here=location.pathname.split("/").pop()||"index.html";
  document.querySelector(".wrap").insertAdjacentHTML("afterbegin","<nav>"+PAGES.map(([h,t])=>`<a href="${h}"${h===here?" aria-current=page":""}>${t}</a>`).join("")+"</nav>");})();
// typed number: empty or out of range turns the cell red, the maths uses the clamped value
function readNum(id){
  const el=$(id),lo=+el.min,hi=+el.max,raw=el.value.trim(),v=Number(raw);
  const ok=raw!==""&&isFinite(v)&&v>=lo&&v<=hi;
  el.classList.toggle("bad",!ok);
  return Math.min(hi,Math.max(lo,raw!==""&&isFinite(v)?v:lo));
}
// optional input: blank gives null (nothing shown), otherwise the clamped number; bad text or out of range turns red
function readOpt(id){
  const el=$(id),lo=+el.min,hi=+el.max,raw=el.value.trim();
  if(raw===""){el.classList.remove("bad");return null;}
  const v=Number(raw),ok=isFinite(v)&&v>=lo&&v<=hi;
  el.classList.toggle("bad",!ok);
  return isFinite(v)?Math.min(hi,Math.max(lo,v)):null;
}
const fix=(x,d=2)=>x.toFixed(d);
const pc=(x,d=2)=>(x*100).toFixed(d)+"%";
const one=(p)=>p>0?"1 in "+Math.round(1/p).toLocaleString("en-US"):"never";
function table(head,rows,cls){ // head: [[text,numeric]], rows: arrays of strings; cls[i] = row class
  return `<thead><tr>${head.map(([t,n])=>`<th${n?' class="n"':""}>${t}</th>`).join("")}</tr></thead><tbody>`+
    rows.map((r,i)=>`<tr${cls&&cls[i]?` class="${cls[i]}"`:""}>${r.map((c,j)=>`<td${head[j][1]?' class="n"':""}>${c}</td>`).join("")}</tr>`).join("")+`</tbody>`;
}
// keeps the inputs in the URL hash so a setup can be linked
function bind(ids,render){
  const p=new URLSearchParams(location.hash.slice(1));
  for(const id of ids){const el=$(id);if(!p.has(id))continue;if(el.type==="checkbox")el.checked=p.get(id)==="1";else el.value=p.get(id);}
  const go=()=>{render();const q=new URLSearchParams();for(const id of ids){const el=$(id);q.set(id,el.type==="checkbox"?(el.checked?1:0):el.value);}
    try{history.replaceState(null,"","#"+q);}catch(e){}};
  for(const id of ids)$(id).addEventListener("input",go);
  go();
}
// type-to-filter box: the list shows the items whose label contains what was typed; box.value is the picked item's value
function combo(id,onPick){
  const el=$(id),ul=document.createElement("ul");ul.className="cl";ul.hidden=true;
  el.parentNode.style.position="relative";el.parentNode.appendChild(ul);
  el.setAttribute("autocomplete","off");el.setAttribute("role","combobox");
  const box={items:[],value:"",hi:0,shown:[]};
  const label=()=>{const it=box.items.find(i=>i.v===box.value);return it?it.t:"";};
  const show=all=>{
    const q=all?"":el.value.trim().toLowerCase();
    box.shown=box.items.filter(i=>i.t.toLowerCase().includes(q));box.hi=0;
    ul.innerHTML=box.shown.map((i,k)=>`<li data-k="${k}"${k===0?' class="on"':""}>${i.t.replace(/[&<>]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]))}</li>`).join("")||'<li class="hint">no match</li>';
    ul.hidden=false;
  };
  const pick=k=>{const it=box.shown[k];if(!it)return;box.value=it.v;el.value=it.t;ul.hidden=true;onPick();};
  const mark=()=>{[...ul.children].forEach((c,k)=>c.classList.toggle("on",k===box.hi));const c=ul.children[box.hi];if(c&&c.scrollIntoView)c.scrollIntoView({block:"nearest"});};
  el.addEventListener("focus",()=>{el.select();show(true);});
  el.addEventListener("input",()=>show(false));
  el.addEventListener("keydown",e=>{
    if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();if(ul.hidden)show(false);const n=box.shown.length;if(n){box.hi=(box.hi+(e.key==="ArrowDown"?1:n-1))%n;mark();}}
    else if(e.key==="Enter"){e.preventDefault();pick(box.hi);}
    else if(e.key==="Escape"){ul.hidden=true;el.value=label();}
  });
  ul.addEventListener("mousedown",e=>{e.preventDefault();const li=e.target.closest("li[data-k]");if(li)pick(+li.dataset.k);});
  el.addEventListener("blur",()=>{ul.hidden=true;el.value=label();});
  box.set=v=>{box.value=v;el.value=label();};
  return box;
}
