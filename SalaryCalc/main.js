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

// 参数区变更联动
["global_salary","param_gjj_rate","param_gjj_base_min","param_gjj_base_max",
 "param_base_min","param_base_max","param_social_rate"].forEach(id=>{
    let el = document.getElementById(id);
    el.addEventListener('input', ()=>{
        saveInputs();
        loadTab();   // 刷新当前tab
    });
});

// Tab切换
tabs.forEach(tab => {
  tab.onclick = () => {
    if(tab.classList.contains('active')) return;
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    activeTab = tab.dataset.tool;
    loadTab();  // 渲染新内容区
  };
});

function getParams(){
  let params = {};
  document.querySelectorAll("input,select").forEach(el => { params[el.id] = el.value; });
  return params;
}

// 自动保存与载入
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
      for(let id in data) if(document.getElementById(id)) document.getElementById(id).value = data[id];
    }catch(e){}
  }
}

// 通用：自动为 tab-content 下input/select绑定input/change事件&保存
function bindTabInputs(){
  tabContent.querySelectorAll('input,select').forEach(el => {
    el.oninput = el.onchange = ()=>{
      triggerCurrentTab();
      saveInputs();
    };
  });
}

function triggerCurrentTab(){
  const params = getParams();
  if(activeTab==="gjj") triggerGJJ(params);
  else if(activeTab==="tax") triggerTax(params);
  else if(activeTab==="ylj") triggerYLJ(params);
}

// 主区：参数面板等
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

function loadTab(){
  // 渲染并绑定事件
  tabContent.innerHTML = "";
  renderMap[activeTab](tabContent, getParams());
  bindTabInputs();
}

loadInputs();
loadTab();

window.triggerAll = function triggerAll(){
  // 可被控制台调试用
  triggerGJJ(getParams());
  triggerTax(getParams());
  triggerYLJ(getParams());
  saveInputs();
};
