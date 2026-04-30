var var1=2;
let let1=3;
const const1=4;
variabila='string'

// console.log(var1);
// console.log(let1);
// console.log(const1);
function testFunction(param){
    if (param==true){
        var var1=2;
        let let1=2;
        const const1=4;
    }
    console.log(var1);
    console.log(let1);
    console.log(const1);
}

const testFunction2 = (param) => {
    if (param==true){
        var var1=2;
        let let1=2;
        const const1=4;
    }
    console.log(var1);
    console.log(let1);
    console.log(const1);
}
const obj={
    name:'Maria',
    age:26,
}
obj.location='Bucharest';
console.log(obj);