# The pourpose of this program

this function defines how to calculate discount or fee
createCalculator takes a function strategyFn as an argument.

# the uses of each code

function createCalculator(strategyFn) {
  return function(amount) {
    return strategyFn(amount);
  };
}

const percentageDiscount = (percent) => (amount) => amount - (amount * percent / 100); // function percentageDiscount that takes 
                                                                                          a percent value.
                                                                                       // Returns a function that takes an amount and calculates the amount after subtracting the percentage discount.

const fixedDiscount = (fixedAmount) => (amount) => amount - fixedAmount; //  function fixedDiscount that takes a fixed discount 
                                                                             amount.
                                                                         // Returns a function that subtracts this fixed discount   from the given amount.

const addFee = (feeAmount) => (amount) => amount + feeAmount; //  function addFee that takes a fee amount.
                                                             // Returns a function that adds this fee to the given amount.

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});  // Creates a readline.Interface instance named rl and Configures it to read input from the terminal (process.stdin) and write   output to the terminal (process.stdout)

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}  // helper function askQuestion that wraps the rl.question method in a Promise.
   // This allows using async/await syntax to ask questions and wait for user input in a clean, sequential manner.

async function main() {
  try {
    const originalAmountInput = await askQuestion('Enter the original amount: '); //Prompts the user to enter the original amount
    const originalAmount = parseFloat(originalAmountInput); //Converts the input string to a floating-point number.
    if (isNaN(originalAmount) || originalAmount < 0) {
      console.log('Please enter a valid positive number for amount.');
      rl.close();
      return;   // Checks if the input is a valid positive number.
    }

    const strategyType = await askQuestion('Choose strategy (percentage, fixed, fee): '); //Asks the user to choose a discount or fee   
                                                                                            strategy.
                                                                                         // Waits for input (percentage, fixed, or fee).

    let valueInput;
    let calculator; //Declares variables to hold the user input for discount/fee value and the calculator function.


     switch (strategyType.toLowerCase()) {
      case 'percentage':
        valueInput = await askQuestion('Enter discount percentage (e.g., 10 for 10%): ');
        const percent = parseFloat(valueInput);
        if (isNaN(percent) || percent < 0 || percent > 100) {
          console.log('Enter a valid percentage between 0 and 100.');
          break;
        }
        calculator = createCalculator(percentageDiscount(percent));
        break; // Asks for the discount percentage.
               // Parses and validates it (must be between 0 and 100).
               // If valid, creates a calculator function using the percentageDiscount strategy and the higher-order function createCalculator.
               // If invalid, prints an error and breaks out of the switch.

      case 'fixed':
        valueInput = await askQuestion('Enter fixed discount amount: ');
        const fixed = parseFloat(valueInput);
        if (isNaN(fixed) || fixed < 0) {
          console.log('Enter a valid positive fixed amount.');
          break;
        }
        calculator = createCalculator(fixedDiscount(fixed));
        break; // Asks for a fixed discount amount.
              // Parses and validates it (must be positive).
              // Creates a calculator function using the fixedDiscount strategy.
              // Handles invalid input similarly.

      case 'fee':
        valueInput = await askQuestion('Enter fee amount to add: ');
        const fee = parseFloat(valueInput);
        if (isNaN(fee) || fee < 0) {
          console.log('Enter a valid positive fee amount.');
          break; 
        }
        calculator = createCalculator(addFee(fee));
        break; // Asks for a fee amount.
               // Parses and validates it (must be positive).
               // Creates a calculator function using the addFee strategy.
   default:
        console.log('Invalid strategy type.');
        rl.close();
        return;
    }   // If the user inputs an invalid strategy, prints an error, closes the CLI, and exits.

       if (calculator) {
      const finalAmount = calculator(originalAmount);
      console.log(`Final amount after applying ${strategyType} strategy: $${finalAmount.toFixed(2)}`);
    }  // Applies the calculator to the original amount.
       // Prints the final amount formatted to 2 decimal places.

  } catch (error) {
    console.error('Error:', error);
  } finally {
    rl.close();
  }
}          // Catches and logs any unexpected errors.
           // Ensures the readline interface is closed regardless of success or failure.

main(); // Calls the main function

# Execution

first download and install node js 

node CLI_DFC.js  // by writing this in the terminal we run the program 