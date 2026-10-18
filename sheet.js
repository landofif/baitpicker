const $=id=>document.getElementById(id);
const PAGES=[["index.html","Bait picker"],["perhour.html","Per hour"]];
(function(){const here=location.pathname.split("/").pop()||"index.html";
  document.querySelector(".wrap").insertAdjacentHTML("afterbegin","<nav>"+PAGES.map(([h,t])=>`<a href="${h}"${h===here?" aria-current=page":""}>${t}</a>`).join("")+"</nav>");})();
// typed number: empty or out of range turns the cell red, the maths uses the clamped value
function readNum(id){
  const el=$(id),lo=+el.min,hi=+el.max,raw=el.value.trim(),v=Number(raw);
  const ok=raw!==""&&isFinite(v)&&v>=lo&&v<=hi;
  el.classList.toggle("bad",!ok);
  return Math.min(hi,Math.max(lo,raw!==""&&isFinite(v)?v:lo));
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
