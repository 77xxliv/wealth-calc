import { renderGJJ, triggerGJJ } from "./gjj.js";
import { renderTax, triggerTax } from "./tax.js";
import { renderYLJ, triggerYLJ } from "./ylj.js";

const tabContent = document.getElementById("tab-content");
const tabs = document.querySelectorAll(".tab");

const renderMap = {
    gjj: renderGJJ,
    tax: renderTax,
    ylj: renderYLJ,
};

let activeTab = "gjj";

// Tab切换
tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    activeTab = tab.dataset.tool;
    loadTab();
  };
});

function loadTab(){
  tabContent.innerHTML = "";
  renderMap[activeTab](tabContent, getParams());
}

// 设置面板开关 & 恢复按钮
document.getElementById("toggle-settings").onclick = () => {
  let sp = document.getElementById("settings-panel");
  if (sp.style.display === "none" || sp.style.display === "") {
    sp.style.display = "block";
    document.getElementById("toggle-settings").innerText = "关闭参数设置";
  } else {
    sp.style.display = "none";
    document.getElementById("toggle-settings").innerText = "打开参数设置";
  }
};
document.getElementById("clear-data").onclick = () => {
  if(confirm("确定恢复默认值并清空所有保存的数据吗？")){
    localStorage.removeItem('financeData');
    location.reload();
  }
};

function getParams(){
  let params = {};
  document.querySelectorAll("input,select").forEach(el => { params[el.id] = el.value; });
  return params;
}

function saveInputs(){
  let data = {};
  document.querySelectorAll('input,select').forEach(el => {data[el.id]=el.value;});
  localStorage.setItem('financeData', JSON.stringify(data));
}
function loadInputs(){
  let data = localStorage.getItem('financeData');
  if(data){
    try{
      data = JSON.parse(data);
      for(let id in data){
        if(document.getElementById(id)){
          document.getElementById(id).value = data[id];
        }
      }
    }catch(e){}
  }
}

function triggerAll(){
  triggerGJJ(getParams());
  triggerTax(getParams());
  triggerYLJ(getParams());
  saveInputs();
}
window.triggerAll = triggerAll;

loadInputs();
loadTab();

document.querySelectorAll('input,select').forEach(el=>{
  el.addEventListener('input',triggerAll);
  el.addEventListener('change',triggerAll);
});
