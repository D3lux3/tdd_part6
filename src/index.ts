import { loadRLEFile, outputSimulatedPattern } from "./parser";
import Simulation from "./Simulation";

const filePath = process.argv[2];
const iterations = Number(process.argv[3]) || undefined;

if (!filePath || !iterations) {
    throw new Error("Please provide a file path and iterations");
}


const { linesBeforeHeader, pattern, width, height, linesAfterPattern } = loadRLEFile(filePath);

let simulation = new Simulation(pattern, height, width);

for (let i = 0; i < iterations; i++) {
    simulation = simulation.nextGeneration();
}

const output = outputSimulatedPattern(simulation, linesBeforeHeader, linesAfterPattern);
console.log(output);