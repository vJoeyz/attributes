import { init } from './init';

console.log(import.meta.url);
console.log(JSON.stringify(import.meta.url));

const { url } = import.meta;
console.log(url);

init();
