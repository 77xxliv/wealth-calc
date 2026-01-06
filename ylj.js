import { getSalary } from "./main.js";

const monthMap = {"50":195,"55":170,"60":139};

export function initYLJ() {
  document.getElementById('ylj_index').addEventListener('input',function(){this.dataset.manual=true;});
  document.getElementById('ylj_details').style.display='none';
}

export function computeYLJ() {
  let s = getSalary('ylj_salary');
  let avg = +document.getElementById('ylj_avg').value;
  let indexInput = document.getElementById('ylj_index');
  if (!indexInput.dataset.manual) {
    indexInput.value = (s / avg).toFixed(2);
  }
  let index = parseFloat(indexInput.value) || 0;
  let yearsPaid = +document.getElementById('ylj_years_paid').value;
  let monthsPaid = +document.getElementById('ylj_months_paid').value;
  let planYears = +document.getElementById('ylj_plan').value;
  let currentBalance = +document.getElementById('ylj_paid').value || 0;

  let salary = index * avg;
  let paidYearsTotal = yearsPaid + monthsPaid / 12;
  let futureYears = planYears - paidYearsTotal;
  if (futureYears < 0) futureYears = 0;
  let futureAmount = futureYears * 12 * salary * 0.08;
  let totalAccount = currentBalance + futureAmount;

  let baseRate = yearsPaid * 0.01 + monthsPaid * 0.00083;
  let basePension = ((avg + salary) / 2) * baseRate;
  let personalPension = totalAccount / monthMap[document.getElementById('ylj_age').value];
  let totalPension = basePension + personalPension;

  document.getElementById('ylj_result').innerHTML =
    `预估养老金（月）：<span class="sum">${totalPension.toFixed(2)}</span> 元<br>` +
    `基础养老金：${basePension.toFixed(2)} 元  个人账户养老金：${personalPension.toFixed(2)} 元<br>` +
    `未来缴费额：${futureAmount.toFixed(2)} 元  退休时个人账户总额：${totalAccount.toFixed(2)} 元`;

  document.getElementById('ylj_details').innerHTML =
    `<b>计算明细</b><br>` +
    `本人缴费基数：${salary.toFixed(2)} 元<br>` +
    `已缴费：${yearsPaid} 年 ${monthsPaid} 月<br>` +
    `未来缴费年限：${futureYears.toFixed(2)} 年<br>` +
    `基础养老金公式：((社平工资 ${avg} + 缴费基数 ${salary.toFixed(2)}) ÷ 2) × (${yearsPaid} × 1% + ${monthsPaid} × 0.083%) = ${basePension.toFixed(2)} 元<br>` +
    `个人账户养老金公式：退休时个人账户总额 ${totalAccount.toFixed(2)} ÷ 计发月数 ${monthMap[document.getElementById('ylj_age').value]} = ${personalPension.toFixed(2)} 元`;
}

export function toggleYLJDetails() {
  let d = document.getElementById('ylj_details');
  let link = document.getElementById('toggle-details');
  if (d.style.display === 'none' || d.style.display === '') {
    d.style.display = 'block';
    link.innerText = '收起计算明细 ▲';
  } else {
    d.style.display = 'none';
    link.innerText = '展开计算明细 ▼';
  }
}
