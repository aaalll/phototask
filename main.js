const { readFileSync } = require("fs");

const getMattes = (customers, mattes = []) => {
  const filteredCustomers = customers
    .filter(
      colors =>
        !colors.some(
          color => color.type === "M" && mattes.includes(color.number)
        )
    )
    .map(colors => colors.filter(color => !mattes.includes(color.number)));

  const noMatch = filteredCustomers.some(colors => colors.length === 0);

  if (noMatch) {
    throw new Error("No solution exists");
  }

  const matteNumbers = filteredCustomers
    .filter(colors => colors.length === 1 && colors[0].type === "M")
    .map(colors => colors[0].number);

  if (!matteNumbers.length) {
    return mattes;
  }

  const uniqueMatteColors = [...new Set(matteNumbers.concat(mattes))];

  return getMattes(filteredCustomers, uniqueMatteColors);
};

const createCustomerArray = input => {
  let [colorsAmount, ...customers] = input.split("\n");
  customers = customers.map(customer => {
      const colors = customer.match( /\d+(M|G)/gi);
      return colors.map(color => {
        const re = /(\d+)(M|G)/gi;

      let item = re.exec(color);
      return {
        number: Number(item[1]),
        type: item[2]
      };
    });
  });

  return {
    colorsAmount: Number(colorsAmount),
    customers
  };
};

const parserInput = inputFile => {
  process.stdout.write(`Parsing ${inputFile}\n`);
  const input = readFileSync(inputFile, "utf8");
  const { colorsAmount, customers } = createCustomerArray(input);
  const mattes = getMattes(customers);

  const output = Array(colorsAmount)
    .fill(null)
    .map((type, index) => {
      return mattes.includes(index + 1) ? "M" : "G";
    });

  return output.join(" ");
};

const inputFile = process.argv[2];
if (!inputFile) {
  process.stderr.write("No solution exists");
  process.exit(1);
}

try {
  const output = parserInput(inputFile);
  process.stdout.write(`${output}\n`);
} catch (e) {
  process.stderr.write("No solution exists");
  process.exit(1);
}
