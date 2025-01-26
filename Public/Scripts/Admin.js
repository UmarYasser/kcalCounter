url='https://expert-tribble-jv7qv746jvw2v7v-3000.app.github.dev/api/v1'
const resMessage = document.getElementById('resMessage')

document.getElementById("foodDB").addEventListener("submit",async function(event){
    event.preventDefault()
    const formEnt = new FormData(this)
    const formData = Object.fromEntries(formEnt.entries())
    if(formData.processed == 'on') {formData.processed = true}
    if(formData.highSugar == 'on') {formData.highSugar = true}
    console.log(formData)

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
            resMessage.textContent = `Food Added In Database ✔`

        //setTimeout(()=>{ location.reload() },1500)

    } catch(e){
        resMessage.textContent = `Error:${e.message} ✗`
    }
}) 

document.getElementById("ExerciseDB").addEventListener('submit',async function(event){
    event.preventDefault()
    try{
        const formEnt = new FormData(this)
        const formData = Object.fromEntries(formEnt.entries())
        console.log(formData)

        const resFetch = await fetch(`${url}/exercise/addExercise`,{
            method:'POST',
            body:JSON.stringify(formData),
            headers:{
                'Content-Type':'application/json'
            }
        })
        const resData = await resFetch.json()
        console.log(resData)
        if(resFetch.ok){
            resMessage.textContent = 'Exercise Added in Database ✔'
            setTimeout(()=>{ location.reload() },2000)
        }

    }catch(e){
        resMessage.textContent = `Error:${e.message} ✗`
    }

})

document.getElementById("DeleteDB").addEventListener('submit', async function(event){
    event.preventDefault()
    const formEnt = new FormData(this)
    const formData = Object.fromEntries(formEnt.entries())

    try{
        const resFetch = await fetch(`${url}/auth/deleteUser`,{
            method:'DELETE',
            body:JSON.stringify(formData),
            headers:{
                'Content-Type':'application/json'
            }
        })
        if(resFetch.ok){
            resMessage.textContent="User Deleted ✔"
            setTimeout(()=>{ location.reload() },9000)
        }
    }catch(e){
        resMessage.textContent = `Error:${e.message} ✗`
    }
})