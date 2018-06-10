const Calc = require('./calc');

function toPercentage(num) {
    return (num * 100) + '%';
}

const input = {
    salary: 34000,
    age: 30,
    pensionAge: 67,
    miFund: {
        total: 271051,
        managementFeeMonthlyDeposit: 0,
        managementFeeFundTotal: 0.0125
    },
    pFund: {
        total: 0,
        managementFeeMonthlyDeposit: 0.015,
        managementFeeFundTotal: 0.002
    },
    factor: 200
};

console.log(`
========================================
===           PENSION CALC           ===
========================================
`.magenta);

const calc = new Calc(input);
const estimatedInterest = 0.042;
const currentTotal = input.miFund.total + input.pFund.total;
const futureTotal = calc.getEstimatedFutureFundTotal(currentTotal, estimatedInterest);
const monthlyPensionGross = calc.getMonthlyPension(futureTotal);
const { managementFeeFundTotal: pfTotalFee, managementFeeMonthlyDeposit: pfMonthlyFee } = input.pFund;
const { managementFeeFundTotal: miTotalFee, managementFeeMonthlyDeposit: miMonthlyFee } = input.miFund;


const pensionFundFees = calc.monthlyDepositFeeSum(pfMonthlyFee) + calc.getTotalFeesFromFundWorth(currentTotal, estimatedInterest, pfTotalFee);
const insuranceFees = calc.monthlyDepositFeeSum(miMonthlyFee) + calc.getTotalFeesFromFundWorth(currentTotal, estimatedInterest, miTotalFee);
const factor = Math.floor(input.factor * 1.15);
const piTotalNeto = futureTotal - pensionFundFees;
const miTotalNeto = futureTotal - insuranceFees;
const monthlyPensionPF = calc.getMonthlyPension(piTotalNeto, factor);
const monthlyPensionMI = calc.getMonthlyPension(miTotalNeto, input.factor);

console.log(`Pension fund fees: ${pensionFundFees.toString().yellow}`);
console.log(`Insurance fees: ${insuranceFees.toString().yellow}`);

console.log(`
${'Without management fees'.red}
=======================
Fund total at ${input.pensionAge}: ${futureTotal.toString().green}
Factor: ${input.factor.toString().green}
Interest: ${(estimatedInterest * 100).toFixed(2).green}%
Monthly pension before management fees: ${monthlyPensionGross.toString().green}
Monthly fee: ${'0%'.green}
Fund total fee: ${'0%'.green}`);

console.log(`
${'In case of pension fund'.red}
=======================
Fund total at ${input.pensionAge}: ${piTotalNeto.toString().green}
Estimated Factor: ${factor.toString().green}
Monthly pension with fees: ${monthlyPensionPF.toString().green}
Monthly fee: ${toPercentage(input.pFund.managementFeeMonthlyDeposit).green}
Fund total fee: ${toPercentage(input.pFund.managementFeeFundTotal).green}`);

console.log(`
${'In case of managers insurence'.red}
=======================
Fund total at ${input.pensionAge}: ${miTotalNeto.toString().green}
Estimated Factor: ${input.factor.toString().green}
Monthly pension with fees: ${monthlyPensionMI.toString().green}
Monthly fee: ${toPercentage(input.miFund.managementFeeMonthlyDeposit).green}
Fund total fee: ${toPercentage(input.miFund.managementFeeFundTotal).green}`);

console.log(`
========================================
===           DONE           ===
========================================
`.magenta);