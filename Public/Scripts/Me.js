const url = 'https://97p7tnf4-3000.uks1.devtunnels.ms/api/v1'
const resMes = document.getElementById("responseMessage")
const xMark ='<i class="fa-solid fa-square-xmark fa-xl"></i>'

document.addEventListener("DOMContentLoaded", async(event)=>{
    try{

        const response = await fetch(`${url}/users/displayDiet`,{
            method:'GET'
        })
        if(!response.ok){
            resMes.textContent = `Fetching Failed: ${response.statusText} ${xMark}`
        }
        
        const dietRes = await response.json();
        console.log(dietRes)
        const dietData = dietRes.data
        document.getElementById("nameSpan").textContent = dietData.Name
        
        document.getElementById("nameField").value = dietData.Name
        
        document.getElementById("weight").value = `${dietData.weight}`
        document.getElementById("height").value = `${dietData.height}`
        document.getElementById("age").value = `${dietData.age}`
        document.querySelector(`input[name="gender"][value="${dietData.gender}"`).checked = true
        document.querySelector('select[name="goal"]').value = dietData.goal
        document.getElementById("daysWorkingOut").value = `${dietData.daysWorkingOut}`

        //Initial Content loaded -> 
        //    / Remove Loader 
        document.getElementById("loadercon").style.display = "none"
        
        
        //    /  Display the divs
       loading = document.getElementsByClassName("loading")
       for(let i =0; i< loading.length;i++){
            loading[i].hidden = false
       }
  
    }catch(e){ 
        resMes.textContent = `Error Fetching: ${e.stack}`
    }
})


//UpdateUser API
document.getElementsByClassName("personal")[0].addEventListener("submit", async function(event){
    event.preventDefault()
    const formEntries = new FormData(this)
    const dataForm = Object.fromEntries(formEntries.entries())
    console.log(this)
    console.log("formEntires.entries():", formEntries.entries())

    console.log("dataForm:", dataForm)

    try{
        const response = await fetch(`${url}/users/updateDiet`,{
            method:"PATCH",
            body: JSON.stringify(dataForm),
            headers:{ 'Content-Type':'application/json'}
        })

        if(response.ok){
            resMes.textContent = `Update Done ✔`
            setTimeout(()=>{ location.reload()},3500)
        }
        else if(!response.ok){
            resMes.textContent = `Fetching Failed: ${response.statusText}`
        } 

        const updateData = await response.json()
        console.log("udpateData:", updateData)

    }catch(e){
        resMes.textContent = `Error Fetching: ${e.message} ${xMark}`
    }
})

//Logging Out
document.getElementById("loggedOut").addEventListener("click", async(event)=>{
    event.preventDefault()
    try{
        const response = await fetch(`${url}/auth/logOut`, {
            method: "POST",
            headers: { "Content-Type": 'application/json'}
        })

        const result = await response.json()
        console.log(result)
        if(response.ok){
            console.log("Log Out Sccessful")
            setTimeout(()=>{
                window.location.href= "./logIn.html"
            }, 3500)
        }
    }catch(e){
        resMes.textContent = `Error Fetching: ${e.message} `
    }
})