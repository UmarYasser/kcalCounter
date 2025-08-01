url='https://97p7tnf4-3000.uks1.devtunnels.ms/api/v1'
const checkMark = `<i class="fa-solid fa-circle-check"></i>`
const xMark ='<i class="fa-solid fa-circle-xmark"></i>'

const resMessage = document.getElementById('resMessage')

//Add Food 
document.getElementById("foodDB").addEventListener("submit",async function(event){
    event.preventDefault()
    const formEnt = new FormData(this)
    const formData = Object.fromEntries(formEnt.entries())
    if(formData.processed == 'on') {formData.processed = true}
    if(formData.highSugar == 'on') {formData.highSugar = true}
    if(formData.highProtien == 'on') {formData.highProtien = true}

    try{
        const resFetch = await fetch(`${url}/food/addFood`,{
            method:'POST',
            body:JSON.stringify(formData),
            headers:{
                'Content-Type':'application/json'
            }
        })
        const resData = await resFetch.json()
        console.log(resData)
        if(resFetch.ok)
            resMessage.innerHTML = `Food Added In Database ✔`

        setTimeout(()=>{ location.reload() },700)

    } catch(e){
        resMessage.textContent = `Error:${e.message} ${xMark}`
    }
}) 


//Add Exercise
document.getElementById("ExerciseDB").addEventListener('submit',async function(event){
    event.preventDefault()
    try{
        const formEnt = new FormData(this)
        const formData = Object.fromEntries(formEnt.entries())

        const resFetch = await fetch(`${url}/exercise/addExercise`,{
            method:'POST',
            body:JSON.stringify(formData),
            headers:{
                'Content-Type':'application/json'
            }
        })
        const resData = await resFetch.json()
        
        if(resFetch.ok){
            resMessage.textContent = 'Exercise Added in Database ✔'
            setTimeout(()=>{ location.reload() },2000)
        }

    }catch(e){
        resMessage.textContent = `Error:${e.message} ${xMark}`
    }

})

//Delete User
document.getElementById("DeleteDB").addEventListener('submit', async function(event){
    event.preventDefault()
    const formEnt = new FormData(this)
    const formData = Object.fromEntries(formEnt.entries())
    console.log(formData)        
    try{
        const resFetch = await fetch(`${url}/auth/deleteUser`,{
            method:'DELETE',
            body:JSON.stringify(formData),
            headers:{
                'Content-Type':'application/json'
            }
        })
        if(resFetch.ok){
            resMessage.innerHTML=`User Deleted ${checkMark}`
            setTimeout(()=>{ location.reload() },9000)
        }
    }catch(e){
        resMessage.innerHTML = `Error:${e.message} ${xMark}`
    }
})