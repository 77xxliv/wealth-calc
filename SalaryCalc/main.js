import { renderGJJ, triggerGJJ } from "./gjj.js";
import { renderTax, triggerTax } from "./tax.js";
import { renderYLJ, triggerYLJ } from "./ylj.js";

// tab 定义
const tabContent = document.getElementById("tab-content");
const tabs = document.querySelectorAll(".tab");
const renderMap = {
  gjj: renderGJJ,
  tax: renderTax,
  ylj: renderYLJ,
};
let activeTab = "gjj";

// 主参数区 input 都要触发刷新
[
  "global_salary",
  "param_gjj_rate", "param_gjj_base_min", "param_gjj_base_max",
  "param_base_min", "param_base_max", "param_social_rate"
].forEach(id => {
  document.getElementById(id).addEventListener("input", () => {
    saveInputs();
    loadTab();  // 立即刷新 tab
  });
});

// tab 切换
tabs.forEach(tab => {
  tab.onclick = () => {
    if (tab.classList.contains("active")) return;
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    activeTab = tab.dataset.tool;
    loadTab();
  };
});

function getParams() {
  let params = {};
  document.querySelectorAll("input,select").forEach(el => { params[el.id] = el.value; });
  return params;
}

// 自动保存
function saveInputs() {
  let data = {};
  document.querySelectorAll('input,select').forEach(el => { data[el.id] = el.value; });
  localStorage.setItem('financeData', JSON.stringify(data));
}

// 自动载入
function loadInputs() {
  let data = localStorage.getItem('financeData');
  if (data) {
    try {
      data = JSON.parse(data);
      for (let id in data)
        if (document.getElementById(id)) document.getElementById(id).value = data[id];
    } catch (e) { }
  }
}

// 重：只为当前 tab-content 内 input 绑定 input/change 事件
function bindTabInputs() {
  tabContent.querySelectorAll('input,select').forEach(el => {
    el.oninput = el.onchange = () => {
      saveInputs();      // 保存
      triggerCurrentTab(); // 刷新
    };
  });
}

// tab内容变化就触发trigger
function triggerCurrentTab() {
  if (activeTab === "gjj") triggerGJJ();
  else if (activeTab === "tax") triggerTax();
  else if (activeTab === "ylj") triggerYLJ();
}

// 参数面板
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
  if (confirm("确定恢复默认值并清空所有保存的数据吗？")) {
    localStorage.removeItem('financeData');
    location.reload();
  }
};

// tab内容渲染
function loadTab() {
  tabContent.innerHTML = "";
  renderMap[activeTab](tabContent, getParams());
  bindTabInputs();
  triggerCurrentTab();
}

loadInputs();
loadTab();

window.triggerAll = function triggerAll() {
  triggerGJJ();
  triggerTax();
  triggerYLJ();
  saveInputs();
};
