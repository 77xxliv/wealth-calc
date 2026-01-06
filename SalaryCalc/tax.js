const monthTable=[{up:3000,rate:0.03,quick:0},{up:12000,rate:0.1,quick:210},{up:25000,rate:0.2,quick:1410},{up:35000,rate:0.25,quick:2660},{up:55000,rate:0.3,quick:4410},{up:80000,rate:0.35,quick:7160},{up:Infinity,rate:0.45,quick:15160}];
const yearTable=[{up:36000,rate:0.03,quick:0},{up:144000,rate:0.1,quick:2520},{up:300000,rate:0.2,quick:16920},{up:420000,rate:0.25,quick:31920},{up:660000,rate:0.3,quick:52920},{up:960000,rate:0.35,quick:85920},{up:Infinity,rate:0.45,quick:181920}];
function getTaxTable(t, tb){ for(let b of tb) if(t<=b.up) return b; }

function autoInsurance(params){
  const minBase=+params['param_base_min'],
        maxBase=+params['param_base_max'],
        socialRate=+params['param_social_rate']/100,
        gjjRate=+params['param_gjj_rate']/100,
        gjjBaseMin=+params['param_gjj_base_min'],
        gjjBaseMax=+params['param_gjj_base_max'];
  let s = +params["tax_salary"] || +params["global_salary"];
  let socialBase=Math.max(minBase,Math.min(s,maxBase));
  let gjjBase=Math.max(gjjBaseMin,Math.min(s,gjjBaseMax));
  let social=socialBase*socialRate, house=gjjBase*gjjRate;
  let input = document.getElementById('tax_insurance');
  if(input) input.value = (social+house).toFixed(2);
}

function calcMonthTax(s,ins,special){
  let base = s-ins-special-5000;
  if(base<=0) return 0;
  let b = getTaxTable(base, monthTable);
  return base*b.rate-b.quick;
}
function calcBonusTax(bonus){
  if(bonus<=0) return 0;
  let avg = bonus/12;
  let b = getTaxTable(avg,monthTable);
  return bonus*b.rate-b.quick;
}
function calcMergeTax(s,ins,special,bonus){
  let total_income = s*12 + bonus;
  let total_deduct = (ins+special+5000)*12;
  let taxable = total_income-total_deduct;
  if(taxable<=0) return 0;
  let b = getTaxTable(taxable,yearTable);
  return taxable*b.rate-b.quick;
}

export function renderTax(node, params){
  node.innerHTML = `
    <h3>上海工资个税计算器 <span class="tip">2025</span></h3>
    <label>月工资（税前，元）</label>
    <input type="number" id="tax_salary" placeholder="留空用全局工资" step="50">
    <label>五险一金（元）</label>
    <input type="number" id="tax_insurance">
    <div class="tip">基数范围及比例来自参数设置</div>
    <label>月专项附加扣除（元）</label>
    <input type="number" id="tax_special" value="1000" step="1000">
    <label>年终奖系数（倍月工资）</label>
    <input type="number" id="tax_bonus_coef" value="4">
    <label>年终奖计税方式</label>
    <select id="tax_bonus_mode">
      <option value="alone">单独计税</option>
      <option value="merge">并入工资</option>
    </select>
    <div class="result" id="tax_result"></div>
  `;
  autoInsurance(params);
  triggerTax(params);
}

export function triggerTax(params){
  let get = id => parseFloat(document.getElementById(id)?.value) || 0;
  let s = get("tax_salary") || parseFloat(params['global_salary']);
  let ins = get("tax_insurance");
  let special = +params['tax_special'] || 0;
  let coef = +params['tax_bonus_coef'] || 0;
  let bonus = s*coef;
  let mode = document.getElementById('tax_bonus_mode').value;
  let monthTax = calcMonthTax(s,ins,special);
  let afterMonth = s-ins-monthTax, bonusTax = 0;
  if(bonus>0){
    if(mode==='alone') bonusTax=calcBonusTax(bonus);
    else bonusTax=calcMergeTax(s,ins,special,bonus)-calcMergeTax(s,ins,special,0);
  }
  let afterBonus=bonus-bonusTax;
  let content = `月到手：<span class="sum">${afterMonth.toFixed(2)}</span> 元<br>年终奖（${coef}倍）：${bonus.toFixed(2)} 元，到手：<span class="sum">${afterBonus.toFixed(2)}</span> 元<br>全年总到手：<span class="sum">${(afterMonth*12+afterBonus).toFixed(2)}</span> 元`;
  document.getElementById('tax_result').innerHTML = content;
}
