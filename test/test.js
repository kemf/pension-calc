const expect = require('chai').expect;
const Calc = require('../src/calc');

describe('Pension calc', function () {
    let calc;
    let input;

    beforeEach(function () {
        input = {
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
        calc = new Calc(input);
    });

    it('getMonthlyDeposit - should return monthly deposit by percentage set in Israeli law', function () {
        const result = calc.getMonthlyDeposit();

        expect(result).to.deep.equal({
            employer: {
                compensation: 2210,//6.5%
                rewards: 2040//6%
            },
            employee: 2040,//6%
            total: 6290
        })
    });

    it('getMonthlyPension - should return monthly pension according to fund and factor', function () {
        const result = calc.getMonthlyPension(271051);
        expect(result).to.equal(1355);
    });

    it('getCompoundInterestFutureValue - should return compound interest future value', function () {
        const data = {
            monthlyDeposit: 200,
            years: 3,
            interest: 0.042
        };

        const result = calc.getCompoundInterestFutureValue(data);
        expect(result).to.equal(7659);
    });

    it('getRibitD - should be able to calculte one time amount', function () {
        const data = {
            years: 5,
            interest: 0.042
        };

        const result = calc.getRibitD(10000, data);
        expect(result).to.equal(12283);
    })

    it('getEstimatedFutureFundTotal - should sum both current fund total and the compunt interest future value', function () {
        const interest = 0.042;
        const currentTotal = input.miFund.total + input.pFund.total;

        const sum = calc.getEstimatedFutureFundTotal(currentTotal, interest);

        expect(sum).to.equal(6680944);
    })

    it('getTotalFeesFromFundWorth - should calculate yearly fees', function () {
        const currentTotal = input.miFund.total + input.pFund.total;
        const sum = calc.getTotalFeesFromFundWorth(currentTotal, 0.042, 0.0125);

        expect(sum).to.equal(1202722);
    })

    it('monthlyDepositFeeSum - should calculate total deposit fee', function () {
        const sum = calc.monthlyDepositFeeSum(0.015);

        expect(sum).to.equal(41891);
    });
});