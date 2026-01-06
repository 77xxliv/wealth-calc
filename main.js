import { renderGJJ } from './gjj.js';
import { renderTax } from './tax.js';
import { renderYLJ } from './ylj.js';

const container = document.getElementById('tool-container');
const tools = {
  gjj: renderGJJ,
  tax: renderTax,
  ylj: renderYLJ
};

// TAB切换事件
document.querySelectorAll('.tab').forEach(tab=>{
  tab.onclick = ()=>{
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    container.innerHTML = ''; // 清空
    tools[tab.dataset.tool](container);
  };
});

// 默认加载第一个Tab
tools['gjj'](container);
