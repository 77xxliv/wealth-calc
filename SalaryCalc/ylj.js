export function triggerYLJ() {
  let get = id => parseFloat(document.getElementById(id)?.value) || 0;
  let s = get("ylj_salary") || get("global_salary");
  let avg = get('ylj_avg');
  let yearsPaid = get('ylj_years_paid'), monthsPaid = get('ylj_months_paid');
  let planYears = get('ylj_plan');
  let currentBalance = get('ylj_paid');
  let indexInput = document.getElementById('ylj_index');
  // index 自动修正
  if (indexInput && !indexInput.dataset.manual) {
    indexInput.value = avg > 0 ? (s / avg).toFixed(2) : '';
  }
  let index = parseFloat(indexInput.value) || 0;
  let salary = index * avg;
  let paidYearsTotal = yearsPaid + monthsPaid / 12;
  let futureYears = planYears - paidYearsTotal;
  if (futureYears < 0) futureYears = 0;
  let futureAmount = futureYears * 12 * salary * 0.08;
  let totalAccount = currentBalance + futureAmount;
  let baseRate = yearsPaid * 0.01 + monthsPaid * 0.00083;
  let basePension = ((avg + salary) / 2) * baseRate;
  let age = document.getElementById('ylj_age').value;
  let personalPension = totalAccount / monthMap[age];
  let totalPension = basePension + personalPension;
  document.getElementById('ylj_result').innerHTML =
    `预估养老金（月）：<span class="sum">${totalPension.toFixed(2)}</span> 元<br>` +
    `基础养老金：${basePension.toFixed(2)} 元  个人账户养老金：${personalPension.toFixed(2)} 元<br>` +
    `未来缴费额：${futureAmount.toFixed(2)} 元  退休时个人账户总额：${totalAccount.toFixed(2)} 元`;
  // 展开明细
  document.getElementById('ylj_details').innerHTML =
    `<b>计算明细</b><br>` +
    `本人缴费基数：${salary.toFixed(2)} 元<br>` +
    `已缴费：${yearsPaid} 年 ${monthsPaid} 月<br>` +
    `未来缴费年限：${futureYears.toFixed(2)} 年<br>` +
    `基础养老金公式：((社平工资 ${avg} + 缴费基数 ${salary.toFixed(2)}) ÷ 2) × (` +
    `${yearsPaid} × 1% + ${monthsPaid} × 0.083%) = ${basePension.toFixed(2)} 元<br>` +
    `个人账户养老金公式：退休时个人账户总额 ${totalAccount.toFixed(2)} ÷ 计发月数 ` +
    `${monthMap[age]} = ${personalPension.toFixed(2)} 元`;
}
