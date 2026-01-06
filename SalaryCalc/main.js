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

// 工具函数：只在 tabContent 查 input
function get(id) {
  const el = tabContent.querySelector(`#${id}`);
  return el ? parseFloat(el.value) || 0 : 0;
}

// 下面传 get 给各 trigger！！避免漏查
export function triggerCurrentTab() {
  if (activeTab === "gjj") triggerGJJ({get});
  if (activeTab === "tax") triggerTax({get});
  if (activeTab === "ylj") triggerYLJ({get});
}

// 渲染绑定
function loadTab() {
  tabContent.innerHTML = "";
  renderMap[activeTab](tabContent);
  bindTabInputs();
  triggerCurrentTab();
}

function bindTabInputs() {
  tabContent.querySelectorAll("input,select").forEach(el => {
    el.oninput = el.onchange = triggerCurrentTab;
  });
}

tabs.forEach(tab => {
  tab.onclick = () => {
    if (tab.classList.contains("active")) return;
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    activeTab = tab.dataset.tool;
    loadTab();
  };
});

window.onload = loadTab;
