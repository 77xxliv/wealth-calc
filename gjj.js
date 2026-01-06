import { getSalary } from "./main.js";

export function initGJJ() {
  document.getElementById('gjj_month_amt').addEventListener('input', function () {
    this.dataset.manual = true;
  });
}

export function computeGJJ() {
  let s = getSalary('gjj_salary');
  let rate = +document.getElementById('param_gjj_rate').value / 100;
  let gjjBaseMin = +document.getElementById('param_gjj_base_min').value;
  let gjjBaseMax = +document.getElementById('param_gjj_base_max').value;
  let base = Math.max(gjjBaseMin, Math.min(s, gjjBaseMax));

  let mInput = document.getElementById('gjj_month_amt');
  if (!mInput.dataset.manual) {
    mInput.value = (base * rate * 2).toFixed(2);
  }
  let m = parseFloat(mInput.value) || 0;
  let y = +document.getElementById('gjj_years').value;
  let b = +document.getElementById('gjj_balance').value;
  let r = 0.015;
  let total = b * Math.pow(1 + r, y) + m * 12 * (Math.pow(1 + r, y) - 1) / r;
  let paid = m * y * 12;
  let interest = total - (b + paid);
  document.getElementById('gjj_result').innerHTML = `最终累计：<span class="sum">${total.toFixed(2)}</span> 元<br>期间缴纳：${paid.toFixed(2)} 元，利息：${interest.toFixed(2)} 元`;
}
