function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
const KEY = "habits_v1";
let habits = JSON.parse(localStorage.getItem(KEY) || "[]");

function save(){ localStorage.setItem(KEY, JSON.stringify(habits)); render(); }
function addHabit(title, color){
  habits.push({id: uid(), title, color, records: {}});
  save();
}
function toggleDone(id){
  const h = habits.find(x=>x.id===id);
  if(!h) return;
  const k = new Date().toISOString().slice(0,10);
  h.records[k] = !h.records[k];
  save();
}
function render(){
  const ul = document.getElementById('list'); ul.innerHTML="";
  for(const h of habits){
    const li = document.createElement('li');
    li.innerHTML = `<span style="background:${h.color}"></span>
      <strong>${h.title}</strong>
      <button data-id="${h.id}">${ (h.records[new Date().toISOString().slice(0,10)] ? '✓' : 'علامة') }</button>`;
    ul.appendChild(li);
  }
}
document.getElementById('addForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const t = document.getElementById('title').value.trim();
  const c = document.getElementById('color').value;
  if(t) addHabit(t,c);
});
document.addEventListener('click', e=>{
  if(e.target.dataset.id) toggleDone(e.target.dataset.id);
});
render();
