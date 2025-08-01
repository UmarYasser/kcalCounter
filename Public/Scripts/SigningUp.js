const url = 'https://97p7tnf4-3000.uks1.devtunnels.ms/api/v1'
const resMessage = document.getElementById("resMessage")
const checkMark = '<i class="fa-solid fa-check-double"></i>'
const xMark ='<i class="fa-solid fa-square-xmark"></i>'
const questionMark ='<i class="fa-solid fa-question"></i>'
const gears = '<i class="fa-solid fa-gears fa-xl" ></i>'
const star = '<i class="fa-solid fa-star fa-xl"></i>'
const eye = '<i class="fa-solid fa-eye fa-xl"></i>'
const eyeSlash = '<i class="fa-solid fa-eye-slash fa-xl"></i>'

document.getElementById("SignUp").addEventListener("submit",async function(event){
    event.preventDefault()

    if( document.getElementById("email").style.boxShadow == 'rgb(218, 86, 86) 0px 0px 5px 4px')
        document.getElementById("email").style.boxShadow = '0px 0px 5px 4px rgb(144, 209, 202)'

    const formEnt = new FormData(this)
    const formData = Object.fromEntries(formEnt.entries())
    if(formData.admin == 'baba') formData.roles='admin'
    console.log(formData)
    try{
        const response = await fetch(`${url}/auth/signUp`,{
        method:'POST',
        body:JSON.stringify(formData),
        headers:{
            'Content-Type': 'application/json'
        }
    })
        const result = await response.json()
        if(response.ok){
            if(result.message == 'This Email is taken'){
                resMessage.innerHTML = `${gears} ${result.message} ${xMark}`
                document.getElementById("email").style.boxShadow = 'rgb(218, 86, 86) 0px 0px 5px 4px'
            }else{
                resMessage.innerHTML = `${star} ${result.message} ${checkMark}`
                sessionStorage.setItem('storedDate','undefined')
                setTimeout(()=>{
                    window.location.href= '/SetUp'
                },1000)
            }
        }else{
            resMessage.innerHTML = `Fetching Failed:${response.status} ${xMark}`

        }
    }catch(e){
        resMessage.textContent=`Error:${e.message} ${xMark}`
    }    
})

document.getElementById("showPassword").addEventListener('click',async(event)=>{
    event.preventDefault()
    document.getElementById('password').type = document.getElementById('password').type == 'password' ? 'text' : 'password' 
    if(document.getElementById('password').type == 'password')
        document.getElementById("showPassword").innerHTML = `${eye}`
    else
        document.getElementById("showPassword").innerHTML = `${eyeSlash}`
})

document.getElementById("showConPassword").addEventListener('click',async(event)=>{
    event.preventDefault()
    document.getElementById('confirmPass').type = document.getElementById('confirmPass').type == 'password' ? 'text' : 'password' 
    if(document.getElementById('confirmPass').type == 'password')
        document.getElementById("showConPassword").innerHTML = `${eye}`
    else
        document.getElementById("showConPassword").innerHTML = `${eyeSlash}`
})