export function renderGJJ(node, params) {
  node.innerHTML = `
    <h3>上海住房公积金累积计算器 <span class="tip">(年利率 1.5%)</span></h3>
    <label>月工资（元）：</label>
    <input type="number" id="gjj_salary" placeholder="留空用全局工资" step="50">
    <label>月缴纳额（元）：</label>
    <input type="number" id="gjj_month_amt">
    <label>缴纳年数：</label>
    <input type="number" id="gjj_years" value="1">
    <label>当前余额（元）：</label>
    <input type="number" id="gjj_balance" value="0">
    <div class="result" id="gjj_result"></div>
  `;
  // 数据变动均重新计算
  document.getElementById("gjj_month_amt").addEventListener('input', function(){this.dataset.manual=true;});
  triggerGJJ(params); // 初次渲染
}

export function triggerGJJ(params) {
  let get = id => parseFloat(document.getElementById(id)?.value) || 0;
  let s = get("gjj_salary") || parseFloat(params['global_salary'])||0;
  let rate = parseFloat(params['param_gjj_rate'])/100;
  let gjjBaseMin = +params['param_gjj_base_min'];
  let gjjBaseMax = +params['param_gjj_base_max'];
  let base = Math.max(gjjBaseMin, Math.min(s, gjjBaseMax));
  let mInput = document.getElementById('gjj_month_amt');
  if(mInput && !mInput.dataset.manual){
      mInput.value = (base*rate*2).toFixed(2);
  }
  let m = parseFloat(mInput.value) || 0;
  let y = get('gjj_years');
  let b = get('gjj_balance');
  let r = 0.015;
  let total = b*Math.pow(1+r, y) + m*12*(Math.pow(1+r,y)-1)/r;
  let paid = m*y*12;
  let interest = total - (b+paid);

  let res = `最终累计：<span class="sum">${total.toFixed(2)}</span> 元<br>期间缴纳：${paid.toFixed(2)} 元，利息：${interest.toFixed(2)} 元`;
  document.getElementById('gjj_result').innerHTML = res;
}
