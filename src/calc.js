const configuration = {
    depositPercentage: {
        employer: {
            compensation: 0.065,
            rewards: 0.06
        },
        employee: 0.06,
        total: 0.185 //this.depositPercentage.employer.compensation + this.depositPercentage.employer.rewards + this.depositPercentage.employee 
    },
    pensionFund: {
        maxDeposit: 19000
    }
};

module.exports = function (data) {
    this.data = data || {
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

    this.getMonthlyDeposit = function () {
        const salary = this.data.salary;
        const depositPercentage = configuration.depositPercentage;
        const result = {
            employer: {
                compensation: salary * depositPercentage.employer.compensation,
                rewards: salary * depositPercentage.employer.rewards //6%
            },
            employee: salary * depositPercentage.employee //6%
        };
        result.total = result.employee + result.employer.compensation + result.employer.rewards;
        return result;
    };
    
    this.getCompoundInterestFutureValue = function ({ monthlyDeposit, years, interest }) {;
        const n = years * 12;
        const R = interest / 12;
        const x = Math.pow((1 + R), n);
        const FV = monthlyDeposit * ((x - 1) / R);
        return Math.floor(FV);
    };

    this.getRibitD = function (amount, { years, interest }) {
        return Math.floor(amount * Math.pow(1 + interest, years));
    };

    this.getMonthlyPension = function (estimatedTotal, factor) {
        if (factor === void 0) { factor = this.data.factor; }
        const result = estimatedTotal / factor;
        return Math.floor(result);
    };

    this.getYearsToPension = function () {
        return this.data.pensionAge - this.data.age;
    };

    this.getEstimatedFutureFundTotal = function (currentTotal, interest, years) {
        if (years === void 0) { years = this.getYearsToPension(); }
        // current fund future value + future fund / factor
        const currentFund = this.getRibitD(currentTotal, { years: years, interest: interest });
        const monthlyDeposit = this.getMonthlyDeposit().total;
        const futureFund = this.getCompoundInterestFutureValue({ monthlyDeposit: monthlyDeposit, years: years, interest: interest });
        return futureFund;
    };

    this.getTotalFeesFromFundWorth = function (currentTotal, interest, fee) {
        const years = this.getYearsToPension() + 1;
        let feeSum = 0;
        // console.log(`=== Fund worth fee calculation ${fee * 100} ===`)
        for (let i = 1; i < years; i++) {
            let total = this.getEstimatedFutureFundTotal(currentTotal, interest, i);
            let feeWorth = total * fee;
            feeSum += feeWorth;
        }
        return Math.floor(feeSum);
    };

    this.monthlyDepositFeeSum = function (fee) {
        const years = this.getYearsToPension();
        const months = years * 12;
        const monthlyFee = this.getMonthlyDeposit().total * fee;
        const total = months * monthlyFee;
        return Math.floor(total);
    };
    
};
