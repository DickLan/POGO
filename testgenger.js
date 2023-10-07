// 測試無效
const input = "全形/半形/";
const terms = input.split(/\uFF0F/);
console.log(input.includes('/')); // ["全形", "半形"]
