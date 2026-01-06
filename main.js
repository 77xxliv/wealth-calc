import { initGJJ, computeGJJ } from './gjj.js';
import { initTax, computeTax, autoInsurance } from './tax.js';
import { initYLJ, computeYLJ, toggleYLJDetails } from './ylj.js';

// 标签切换
document.querySelectorAll('.tab').forEach(t => {
  t.onclick = () => {
    document.querySelectorAll('.tab').forEach(tt => tt.classList.remove('active'));
    document.querySelectorAll('.tool').forEach(div => div.classList.remove('active'));
    t.classList.add('active');
    document.getElementById(t.dataset.tool).classList.add('active');
  };
});

// 参数面板开关
document.getElementById('toggle-settings').onclick = () => {
  let sp = document.getElementById('settings-panel');
  if (sp.style.display === 'none' || sp.style.display === '') {
    sp.style.display = 'block';
    document.getElementById('toggle-settings').innerText = '关闭参数设置';
  } else {
    sp.style.display = 'none';
    document.getElementById('toggle-settings').innerText = '打开参数设置';
  }
};

// 清空
document.getElementById('clear-data').onclick = () => {
  if (confirm('确定要恢复默认值并清空所有保存的数据吗？')) {
    localStorage.removeItem('financeData');
    location.reload();
  }
};

// 获取工资
export function getSalary(id) {
  let val = parseFloat(document.getElementById(id).value);
  if (isNaN(val) || val <= 0) {
    val = parseFloat(document.getElementById('global_salary').value);
  }
  return isNaN(val) ? 0 : val;
}

// 保存与加载
function saveInputs() {
  let data = {};
  document.querySelectorAll('input,select').forEach(el => { data[el.id] = el.value; });
  localStorage.setItem('financeData', JSON.stringify(data));
}
function loadInputs() {
  let data = localStorage.getItem('financeData');
  if (data) {
    try {
      data = JSON.parse(data);
      for (let id in data) {
        if (document.getElementById(id)) {
          document.getElementById(id).value = data[id];
        }
      }
    } catch (e) { }
  }
}

function triggerAll() {
  autoInsurance();
  computeGJJ();
  computeTax();
  computeYLJ();
  saveInputs();
}

// 监听
document.querySelectorAll('input,select').forEach(el => {
  el.addEventListener('input', triggerAll);
  el.addEventListener('change', triggerAll);
});

// 养老金明细切换
document.getElementById('toggle-details').onclick = toggleYLJDetails;
document.getElementById('ylj_details').style.display = 'none';

// 各模块初始及还原
initGJJ();
initTax();
initYLJ();
loadInputs();
triggerAll();
