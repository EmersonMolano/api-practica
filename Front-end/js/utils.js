//cargue de tabla

function loadData(table,registers){
clearTable(table);
if(Array.isArray(registers)){
registers.forEach(register=>{
    loadTable(table,register);
})
}else{
    loadTable(table,registers);
}

}

function loadTable(table,data){

    
    //creación de la estructura de la tabla    
    var register=document.createElement("tr");
     Object.values(data).forEach(element => {
        const cell=document.createElement("td");
        cell.innerText=element;
        register.appendChild(cell);
    });
    table.appendChild(register);
}

function clearTable(table){
    table.innerHTML="";

}