const devurl = 'https://kcalcounter.onrender.com/api/v1'
const resMessage = document.getElementById("resMessage")
const url = new URL(window.location.href)
const params = new URLSearchParams(url.search)
const token = params.get('token')
const xMark ='<i class="fa-solid fa-square-xmark fa-xl"></i>'

document.getElementById('ResetPassword').addEventListener('submit',async function(event){
    event.preventDefault()

    const formEnt = new FormData(this)
    const formData = Object.fromEntries(formEnt.entries())

    try{
        const resFetch = await fetch(`${devurl}/auth/resetPassword/${token}`,{
            method:'PATCH',
            headers:{
                "Content-Type":'application/json'
            },
            body:JSON.stringify(formData)
        })
        const resData = await resFetch.json()
        
        if(resFetch.ok){
            resMessage.innerHTML = `Password Reset ✔\nYou can now log in using the new password. This Page will close now`
            setTimeout(()=>{ window.close()},3500)
        }else{
            if(resData.message == "Invalid Token")
                resMessage.innerHTML = `The Token has Expired, please make a request again.. ${xMark}`
            else
                resMessage.innerHTML = `Error: ${resData.message} ${xMark}`   
        }
    }catch(e){
        resMessage.innerHTML = `Error:${e.message} ${xMark}`

    }
})
