import readline from "readline";

// Higher-order function: takes a strategy function and returns a calculator function
function createCalculator(strategyFn) {
  return function(amount) {
    return strategyFn(amount);
  };
}

// Discount and fee strategies
const percentageDiscount = (percent) => (amount) => amount - (amount * percent / 100);
const fixedDiscount = (fixedAmount) => (amount) => amount - fixedAmount;
const addFee = (feeAmount) => (amount) => amount + feeAmount;

// Setup readline interface for CLI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions sequentially using Promises
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Main async function to run the CLI app
async function main() {
  try {
    const originalAmountInput = await askQuestion('Enter the original amount: ');
    const originalAmount = parseFloat(originalAmountInput);
    if (isNaN(originalAmount) || originalAmount < 0) {
      console.log('Please enter a valid positive number for amount.');
      rl.close();
      return;
    }

    const strategyType = await askQuestion('Choose strategy (percentage, fixed, fee): ');

    let valueInput;
    let calculator;

    switch (strategyType.toLowerCase()) {
      case 'percentage':
        valueInput = await askQuestion('Enter discount percentage (e.g., 10 for 10%): ');
        const percent = parseFloat(valueInput);
        if (isNaN(percent) || percent < 0 || percent > 100) {
          console.log('Enter a valid percentage between 0 and 100.');
          break;
        }
        calculator = createCalculator(percentageDiscount(percent));
        break;

      case 'fixed':
        valueInput = await askQuestion('Enter fixed discount amount: ');
        const fixed = parseFloat(valueInput);
        if (isNaN(fixed) || fixed < 0) {
          console.log('Enter a valid positive fixed amount.');
          break;
        }
        calculator = createCalculator(fixedDiscount(fixed));
        break;

      case 'fee':
        valueInput = await askQuestion('Enter fee amount to add: ');
        const fee = parseFloat(valueInput);
        if (isNaN(fee) || fee < 0) {
          console.log('Enter a valid positive fee amount.');
          break;
        }
        calculator = createCalculator(addFee(fee));
        break;

      default:
        console.log('Invalid strategy type.');
        rl.close();
        return;
    }

    if (calculator) {
      const finalAmount = calculator(originalAmount);
      console.log(`Final amount after applying ${strategyType} strategy: $${finalAmount.toFixed(2)}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
}

main();
