const monthMap={"50":195,"55":170,"60":139};

export function renderYLJ(node, params) {
  node.innerHTML = `
    <h3>上海养老金预估 <span class="tip">精确到月</span></h3>
    <label>月工资（元）：</label>
    <input type="number" id="ylj_salary" placeholder="留空用全局工资" step="50">
    <div class="row"><div style="flex:1">
      <label>已缴费年数：</label>
      <input type="number" id="ylj_years_paid" value="0"></div>
      <div style="flex:1"><label>已缴费月数：</label>
      <input type="number" id="ylj_months_paid" value="0"></div></div>
    <label>计划总缴费年限（年）：</label>
    <input type="number" id="ylj_plan" value="20">
    <label>当前个人账户余额（元）：</label>
    <input type="number" id="ylj_paid" value="85000">
    <label>本人缴费指数：</label>
    <input type="number" id="ylj_index" value="1.2" step="0.01">
    <label>退休年龄</label>
    <select id="ylj_age"><option value="60">60岁（男）</option><option value="55">55岁（女干部）</option><option value="50">50岁（女工人）</option></select>
    <label>上年社平工资（元）</label>
    <input type="number" id="ylj_avg" value="12434">
    <div class="result" id="ylj_result"></div>
    <span class="toggle-link" id="toggle-details">展开计算明细 ▼</span>
    <div class="details" id="ylj_details"></div>
  `;
  document.getElementById('ylj_index').addEventListener('input', function(){this.dataset.manual=true;});
  let detailsDiv = document.getElementById('ylj_details');
  detailsDiv.style.display = 'none';
  document.getElementById('toggle-details').onclick = () => {
      if(detailsDiv.style.display==='none'||detailsDiv.style.display===''){
        detailsDiv.style.display='block';
        document.getElementById('toggle-details').innerText='收起计算明细 ▲';
      }else{
        detailsDiv.style.display='none';
        document.getElementById('toggle-details').innerText='展开计算明细 ▼';
      }
  };
  triggerYLJ(params);
}

export function triggerYLJ(params){
  let get = id => parseFloat(document.getElementById(id)?.value) || 0;
  let s = get("ylj_salary") || +document.getElementById("global_salary")?.value || 0;
  let avg = +document.getElementById('ylj_avg')?.value || 0;
  let indexInput=document.getElementById('ylj_index');
  if(indexInput && !indexInput.dataset.manual){
    indexInput.value = avg>0 ? (s/avg).toFixed(2) : '';
  }
  let index = parseFloat(indexInput.value) || 0;
  let yearsPaid = get('ylj_years_paid'), monthsPaid = get('ylj_months_paid');
  let planYears = +document.getElementById('ylj_plan')?.value || 0;
  let currentBalance = +document.getElementById('ylj_paid')?.value || 0;
  let salary = index*avg;
  let paidYearsTotal = yearsPaid + monthsPaid/12;
  let futureYears = planYears - paidYearsTotal;
  if(futureYears<0) futureYears=0;
  let futureAmount = futureYears*12*salary*0.08;
  let totalAccount = currentBalance + futureAmount;
  let baseRate = yearsPaid*0.01 + monthsPaid*0.00083;
  let basePension = ((avg+salary)/2) * baseRate;
  let age = document.getElementById('ylj_age').value;
  let personalPension = totalAccount / monthMap[age];
  let totalPension = basePension + personalPension;
  document.getElementById('ylj_result').innerHTML =
    `预估养老金（月）：<span class="sum">${totalPension.toFixed(2)}</span> 元<br>`+
    `基础养老金：${basePension.toFixed(2)} 元  个人账户养老金：${personalPension.toFixed(2)} 元<br>`+
    `未来缴费额：${futureAmount.toFixed(2)} 元  退休时个人账户总额：${totalAccount.toFixed(2)} 元`;
  document.getElementById('ylj_details').innerHTML =
    `<b>计算明细</b><br>`+
    `本人缴费基数：${salary.toFixed(2)} 元<br>`+
    `已缴费：${yearsPaid} 年 ${monthsPaid} 月<br>`+
    `未来缴费年限：${futureYears.toFixed(2)} 年<br>`+
    `基础养老金公式：((社平工资 ${avg} + 缴费基数 ${salary.toFixed(2)}) ÷ 2) × (`+
    `${yearsPaid} × 1% + ${monthsPaid} × 0.083%) = ${basePension.toFixed(2)} 元<br>`+
    `个人账户养老金公式：退休时个人账户总额 ${totalAccount.toFixed(2)} ÷ 计发月数 `+
    `${monthMap[age]} = ${personalPension.toFixed(2)} 元`;
}
